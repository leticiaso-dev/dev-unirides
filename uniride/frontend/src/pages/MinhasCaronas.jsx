import { useEffect, useState } from 'react'
import { api } from '../api.js'
import CartaoCarona from '../components/CartaoCarona.jsx'
import Etiqueta from '../components/Etiqueta.jsx'

export default function MinhasCaronas() {
  const [aba, setAba] = useState('motorista')   // 'motorista' ou 'passageiro'
  const [caronas, setCaronas] = useState([])

  // Recarrega a lista sempre que a aba muda
  useEffect(() => {
    async function carregar() {
      const dados = await api('caronas/minhas.php?aba=' + aba)
      setCaronas(dados.caronas)
    }
    carregar()
  }, [aba])

  return (
    <div className="conteudo">
      <h1>Minhas viagens</h1>
      <p className="dica">Histórico e próximas caronas.</p>

      <div className="abas">
        <button className={aba === 'motorista' ? 'ativo' : ''} onClick={() => setAba('motorista')}>🚗 Motorista</button>
        <button className={aba === 'passageiro' ? 'ativo' : ''} id="aba-passageiro" onClick={() => setAba('passageiro')}>🙋 Passageiro(a)</button>
      </div>

      {caronas.length === 0 && <div className="vazio"><div className="emoji">🚘</div>Nada por aqui ainda.</div>}

      {caronas.map((c) => (
        <CartaoCarona
          key={c.id}
          carona={c}
          valor={c.valor_atual}
          rotuloValor="valor por pessoa"
          extra={
            <>
              <Etiqueta status={c.status} />
              {aba === 'passageiro' && <span>Meu pedido: <Etiqueta status={c.meu_pedido} /></span>}
            </>
          }
        />
      ))}
    </div>
  )
}
