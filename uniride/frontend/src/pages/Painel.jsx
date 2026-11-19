import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import Etiqueta from '../components/Etiqueta.jsx'
import { dataHora } from '../utils.js'

export default function Painel({ usuario, sair }) {
  const [dados, setDados] = useState(null)

  useEffect(() => {
    async function carregar() {
      const resposta = await api('usuarios/painel.php')
      setDados(resposta)
    }
    carregar()
  }, [])

  if (dados === null) {
    return <p className="conteudo">Carregando...</p>
  }

  const primeiroNome = usuario.nome.split(' ')[0]
  let nota = '–'
  if (dados.nota.media !== null) {
    nota = dados.nota.media.toFixed(1).replace('.', ',') + ' ★'
  }

  return (
    <>
      <div className="topo-simples">
        <img src="/logo.svg" alt="UniRide" width="40" height="40" />
        <button className="sair" onClick={sair}>Sair</button>
      </div>
      <div className="conteudo">
        <h1>Olá, {primeiroNome}!</h1>
        <p className="dica">Para onde vamos hoje?</p>

        <div className="atalhos">
          <Link className="atalho" to="/buscar"><span className="emoji">🔍</span>Buscar carona<small>Vou de passageiro</small></Link>
          <Link className="atalho claro" to="/oferecer"><span className="emoji">🚗</span>Oferecer carona<small>Vou de carro</small></Link>
        </div>

        <div className="secao-titulo">Resumo</div>
        <div className="indicadores">
          <div className="indicador"><b>{nota}</b><span>Minha avaliação</span></div>
          <div className="indicador"><b>{dados.totalViagens}</b><span>Viagens concluídas</span></div>
          <div className="indicador"><b>{dados.pedidosPendentes}</b><span>Pedidos aguardando você</span></div>
          <div className="indicador"><b>{dados.paraAvaliar.length}</b><span>Avaliações pendentes</span></div>
        </div>

        {dados.paraAvaliar.length > 0 && (
          <>
            <div className="secao-titulo">⭐ Avalie suas viagens</div>
            {dados.paraAvaliar.map((c) => (
              <div className="cartao" key={c.id}>
                <div className="rota"><span className="ponto">{c.origem}</span><span className="traco"></span><span className="ponto fim">{c.destino}</span></div>
                <div className="rodape-cartao">
                  <span className="dica">{dataHora(c.data_hora)}</span>
                  <Link className="btn pequeno" to={'/carona/' + c.id}>Avaliar</Link>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="secao-titulo">Como motorista</div>
        {dados.comoMotorista.length === 0 && <p className="dica">Você não tem caronas oferecidas.</p>}
        {dados.comoMotorista.map((c) => (
          <div className="cartao" key={c.id}>
            <div className="rota"><span className="ponto">{c.origem}</span><span className="traco"></span><span className="ponto fim">{c.destino}</span></div>
            <div className="meta">
              <span>🕒 {dataHora(c.data_hora)}</span>
              <span>💺 {c.aceitos}/{c.vagas} ocupadas</span>
              {c.pendentes > 0 && <span className="etiqueta PENDENTE">{c.pendentes} pedido(s)</span>}
            </div>
            <div className="rodape-cartao">
              <span></span>
              <Link className="btn pequeno" to={'/carona/' + c.id}>Gerenciar</Link>
            </div>
          </div>
        ))}

        <div className="secao-titulo">Como passageiro(a)</div>
        {dados.comoPassageiro.length === 0 && <p className="dica">Nenhuma carona solicitada.</p>}
        {dados.comoPassageiro.map((c) => (
          <div className="cartao" key={c.id}>
            <div className="rota"><span className="ponto">{c.origem}</span><span className="traco"></span><span className="ponto fim">{c.destino}</span></div>
            <div className="meta">
              <span>🕒 {dataHora(c.data_hora)}</span>
              <span>👤 {c.motorista}</span>
              <Etiqueta status={c.meu_pedido} />
            </div>
            <div className="rodape-cartao">
              <span></span>
              <Link className="btn pequeno" to={'/carona/' + c.id}>Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
