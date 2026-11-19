import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'
import { dinheiro, numero } from '../utils.js'

// Data de amanhã no formato AAAA-MM-DD (valor inicial do campo "Data")
function amanha() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString('sv-SE')
}

export default function Oferecer() {
  const [veiculos, setVeiculos] = useState([])
  const [veiculoId, setVeiculoId] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('Senac Santo Amaro')
  const [data, setData] = useState(amanha())
  const [hora, setHora] = useState('18:00')
  const [distancia, setDistancia] = useState('')
  const [preco, setPreco] = useState('6.29')
  const [vagas, setVagas] = useState(3)
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  // Carrega os veículos do motorista
  useEffect(() => {
    async function carregar() {
      const dados = await api('veiculos/listar.php')
      setVeiculos(dados.veiculos)
      if (dados.veiculos.length > 0) {
        setVeiculoId(dados.veiculos[0].id)
      }
    }
    carregar()
  }, [])

  async function publicar() {
    try {
      const dados = await api('caronas/criar.php', {
        veiculo_id: veiculoId,
        origem: origem,
        destino: destino,
        data: data,
        hora: hora,
        distancia: distancia,
        preco_combustivel: preco,
        vagas: vagas,
        observacoes: observacoes,
      })
      navigate('/carona/' + dados.id)
    } catch (e) {
      setErro(e.message)
      window.scrollTo(0, 0)
    }
  }

  // Procura o veículo escolhido para saber o consumo dele
  let consumo = 0
  for (const v of veiculos) {
    if (String(v.id) === String(veiculoId)) {
      consumo = v.consumo
    }
  }

  // Prévia do rateio (a mesma conta é feita de novo no PHP)
  const custo = (Number(distancia) / consumo) * Number(preco)
  const temPrevia = consumo > 0 && Number(distancia) > 0 && Number(preco) > 0

  return (
    <>
      <Mapa voltar altura={180} />
      <div className="painel">
        <h1>Oferecer carona</h1>
        <p className="dica">O sistema calcula quanto cada pessoa paga.</p>

        {veiculos.length === 0 && (
          <div className="alerta aviso">Cadastre seu veículo em <Link to="/perfil">Perfil</Link> para oferecer caronas.</div>
        )}
        {erro && <div className="alerta erro">{erro}</div>}

        <div className="campo-icone">
          <span className="ponto-origem"></span>
          <input id="origem" placeholder="Saindo de" value={origem} onChange={(e) => setOrigem(e.target.value)} />
        </div>
        <div className="campo-icone">
          <span className="ponto-destino"></span>
          <input id="destino" placeholder="Para onde você vai?" value={destino} onChange={(e) => setDestino(e.target.value)} />
        </div>

        <div className="linha-campos">
          <div className="campo"><label htmlFor="data">Data</label><input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
          <div className="campo"><label htmlFor="hora">Saída</label><input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} /></div>
        </div>

        <div className="contador">
          <b>Vagas no carro</b>
          <div className="controles">
            <button onClick={() => { if (vagas > 1) setVagas(vagas - 1) }}>–</button>
            <span>{vagas}</span>
            <button className="mais" onClick={() => setVagas(vagas + 1)}>+</button>
          </div>
        </div>

        <div className="linha-campos">
          <div className="campo"><label htmlFor="distancia">Distância (km)</label><input id="distancia" type="number" placeholder="12" value={distancia} onChange={(e) => setDistancia(e.target.value)} /></div>
          <div className="campo"><label htmlFor="preco">Combustível (R$/l)</label><input id="preco" type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} /></div>
        </div>

        <div className="campo">
          <label htmlFor="veiculo">Veículo</label>
          <select id="veiculo" value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)}>
            {veiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.modelo} {v.cor} · {v.placa}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="observacoes">Observações (opcional)</label>
          <textarea id="observacoes" placeholder="Ponto de encontro, regras do carro..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </div>

        <div className="rateio" style={{ marginBottom: 14 }}>
          <b>💰 Rateio estimado</b>
          {!temPrevia && <p className="dica" style={{ margin: '6px 0 0' }}>Informe a distância para ver o valor.</p>}
          {temPrevia && (
            <>
              <div className="linha"><span>Consumo do veículo</span><span>{numero(consumo)} km/l</span></div>
              <div className="linha"><span>Custo total da viagem</span><span>{dinheiro(custo)}</span></div>
              <div className="linha"><span>Com 1 passageiro</span><span>{dinheiro(custo / 2)} por pessoa</span></div>
              <div className="linha total"><span>Carro cheio ({vagas + 1} pessoas)</span><span>{dinheiro(custo / (vagas + 1))}</span></div>
            </>
          )}
        </div>

        <button className="btn bloco" id="publicar" onClick={publicar} disabled={veiculos.length === 0}>Publicar carona</button>
        <p className="dica centro" style={{ marginTop: 10 }}>Sem lucro: o valor cobre só o combustível, dividido entre todos, incluindo você.</p>
      </div>
    </>
  )
}
