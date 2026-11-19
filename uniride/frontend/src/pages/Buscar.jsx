import { useEffect, useState } from 'react'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'
import CartaoCarona from '../components/CartaoCarona.jsx'

export default function Buscar() {
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [quando, setQuando] = useState('agora')   // 'agora' = próximas caronas; 'agendar' = escolher a data
  const [data, setData] = useState('')
  const [lugares, setLugares] = useState(1)
  const [caronas, setCaronas] = useState([])
  const [buscou, setBuscou] = useState(false)

  async function buscar() {
    // encodeURIComponent troca espaços e acentos por códigos que podem ir na URL
    let endereco = 'caronas/buscar.php?origem=' + encodeURIComponent(origem) +
      '&destino=' + encodeURIComponent(destino) + '&lugares=' + lugares
    if (quando === 'agendar') {
      endereco = endereco + '&data=' + data
    }
    const dados = await api(endereco)
    setCaronas(dados.caronas)
    setBuscou(true)
  }

  // Ao abrir a página, já mostra as próximas caronas
  useEffect(() => {
    buscar()
  }, [])

  function diminuir() {
    if (lugares > 1) {
      setLugares(lugares - 1)
    }
  }

  return (
    <>
      <Mapa voltar />
      <div className="painel">
        <h1>Buscar carona</h1>

        <div className="campo-icone">
          <span className="ponto-origem"></span>
          <input id="origem" placeholder="Saindo de (bairro, estação...)" value={origem} onChange={(e) => setOrigem(e.target.value)} />
        </div>
        <div className="campo-icone">
          <span className="ponto-destino"></span>
          <input id="destino" placeholder="Para onde você vai?" value={destino} onChange={(e) => setDestino(e.target.value)} />
        </div>

        <div className="campo"><label>Quando</label></div>
        <div className="alternar">
          <button className={quando === 'agora' ? 'ativo' : ''} onClick={() => setQuando('agora')}>Agora</button>
          <button className={quando === 'agendar' ? 'ativo' : ''} onClick={() => setQuando('agendar')}>Agendar</button>
        </div>
        {quando === 'agendar' && (
          <div className="campo"><input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
        )}

        <div className="contador">
          <b>Lugares</b>
          <div className="controles">
            <button onClick={diminuir}>–</button>
            <span>{lugares}</span>
            <button className="mais" onClick={() => setLugares(lugares + 1)}>+</button>
          </div>
        </div>

        <button className="btn bloco" id="buscar" onClick={buscar}>Buscar carona</button>

        {buscou && <div className="secao-titulo">{caronas.length} carona(s) encontrada(s)</div>}
        {buscou && caronas.length === 0 && (
          <div className="vazio"><div className="emoji">🔎</div>Nenhuma carona encontrada. Tente outro horário ou bairro próximo.</div>
        )}
        {caronas.map((c) => (
          <CartaoCarona key={c.id} carona={c} valor={c.valor_carro_cheio} rotuloValor="a partir de (por pessoa)" />
        ))}
      </div>
    </>
  )
}
