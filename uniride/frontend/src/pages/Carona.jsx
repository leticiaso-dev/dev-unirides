import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'
import Estrelas from '../components/Estrelas.jsx'
import Etiqueta from '../components/Etiqueta.jsx'
import AvaliarPessoa from '../components/AvaliarPessoa.jsx'
import { dataHora, dinheiro, iniciais, nomeVinculo, numero } from '../utils.js'

export default function Carona() {
  const { id } = useParams()                   // id da carona que vem na URL: /carona/3
  const [dados, setDados] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [pontoEmbarque, setPontoEmbarque] = useState('')
  const [recado, setRecado] = useState('')

  async function carregar() {
    const resposta = await api('caronas/detalhe.php?id=' + id)
    setDados(resposta)
    if (pontoEmbarque === '') {
      setPontoEmbarque(resposta.carona.origem)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  // Envia uma ação desta tela para a API (solicitar, aceitar, concluir...) e recarrega os dados
  async function executar(acao, extras) {
    setErro('')
    setMensagem('')
    try {
      const corpo = { carona_id: id, acao: acao }
      Object.assign(corpo, extras)   // junta os campos extras (se houver)
      const resposta = await api('caronas/acao.php', corpo)
      setMensagem(resposta.mensagem)
      await carregar()
    } catch (e) {
      setErro(e.message)
    }
    window.scrollTo(0, 0)
  }

  function avaliar(pessoaId, nota, comentario) {
    executar('avaliar', { avaliado_id: pessoaId, nota: nota, comentario: comentario })
  }

  if (dados === null) {
    return <p className="conteudo">Carregando...</p>
  }

  const carona = dados.carona
  const souMotorista = dados.souMotorista
  const meuPedido = dados.meuPedido

  // Regras para mostrar o formulário de solicitação
  const pedidoAtivo = meuPedido !== null && meuPedido.status !== 'CANCELADA'
  const podeSolicitar = !souMotorista && !pedidoAtivo && carona.status === 'ABERTA' && carona.vagas_livres > 0

  let textoPessoas = 'Pessoas no carro'
  if (carona.aceitos === 0) {
    textoPessoas = 'Pessoas no carro (estimativa com 1 passageiro)'
  }

  return (
    <>
      <Mapa voltar altura={170} />
      <div className="painel">
        {mensagem && <div className="alerta sucesso">{mensagem}</div>}
        {erro && <div className="alerta erro">{erro}</div>}

        <div className="acoes" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <Etiqueta status={carona.status} />
          <span className="dica">🕒 {dataHora(carona.data_hora)}</span>
        </div>
        <div className="rota" style={{ marginBottom: 14 }}>
          <span className="ponto">{carona.origem}</span><span className="traco"></span><span className="ponto fim">{carona.destino}</span>
        </div>

        {/* ---------- Visão do passageiro: dados do motorista ---------- */}
        {!souMotorista && (
          <div className="cartao">
            <div className="pessoa">
              <span className="avatar">{iniciais(carona.motorista)}</span>
              <div className="info">
                <Link to={'/perfil/' + carona.motorista_id}>{carona.motorista}</Link>
                <small>{nomeVinculo(carona.vinculo)} · {carona.curso_setor}</small>
              </div>
              <Estrelas media={carona.nota_motorista.media} />
            </div>
            <div className="meta"><span>🚗 <b>{carona.modelo}</b> {carona.cor} · {carona.placa}</span></div>
            {carona.observacoes && <p className="dica" style={{ margin: '8px 0 0' }}>💬 {carona.observacoes}</p>}
          </div>
        )}

        {/* ---------- Visão do motorista: pedidos de vaga ---------- */}
        {souMotorista && (
          <div className="cartao">
            <h3>📥 Pedidos de vaga ({dados.pendentes.length})</h3>
            {dados.pendentes.length === 0 && <p className="dica">Nenhum pedido aguardando resposta.</p>}
            {dados.pendentes.map((p) => (
              <div className="pessoa" key={p.id} style={{ flexWrap: 'wrap' }}>
                <span className="avatar">{iniciais(p.nome)}</span>
                <div className="info">
                  <b>{p.nome}</b> <Estrelas media={p.nota.media} />
                  <small>{nomeVinculo(p.vinculo)} · {p.curso_setor}</small>
                  <small>📍 {p.ponto_embarque}</small>
                  {p.mensagem && <small>💬 "{p.mensagem}"</small>}
                </div>
                {carona.status === 'ABERTA' && (
                  <div className="acoes" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <button className="btn pequeno contorno vermelho" onClick={() => executar('recusar', { solicitacao_id: p.id })}>Recusar</button>
                    <button className="btn pequeno" onClick={() => executar('aceitar', { solicitacao_id: p.id })}>Aceitar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ---------- Passageiros confirmados ---------- */}
        <div className="cartao">
          <h3>Passageiros confirmados ({carona.aceitos}/{carona.vagas})</h3>
          {dados.passageiros.length === 0 && <p className="dica">Nenhum passageiro confirmado ainda.</p>}
          {dados.passageiros.map((p) => (
            <div className="pessoa" key={p.id}>
              <span className="avatar">{iniciais(p.nome)}</span>
              <div className="info">
                <Link to={'/perfil/' + p.id}>{p.nome}</Link>
                <small>Embarque: {p.ponto_embarque}</small>
              </div>
              <Estrelas media={p.nota.media} />
            </div>
          ))}
        </div>

        {/* ---------- Avaliação (depois da viagem concluída) ---------- */}
        {dados.paraAvaliar.length > 0 && (
          <div className="cartao" id="avaliar">
            <h3>⭐ Como foi a viagem?</h3>
            {dados.paraAvaliar.map((p) => (
              <AvaliarPessoa key={p.id} pessoa={p} papel={souMotorista ? 'Passageiro(a)' : 'Motorista'} enviar={avaliar} />
            ))}
          </div>
        )}

        {/* ---------- Passageiro: status do meu pedido ---------- */}
        {!souMotorista && pedidoAtivo && (
          <div className="cartao">
            <h3>Minha solicitação <Etiqueta status={meuPedido.status} /></h3>
            {meuPedido.status === 'PENDENTE' && <p className="dica">Pedido enviado. Aguarde a resposta do motorista.</p>}
            {meuPedido.status === 'ACEITA' && <p className="dica">Vaga confirmada! Esteja em <b>{meuPedido.ponto_embarque}</b> no horário combinado.</p>}
            {meuPedido.status === 'RECUSADA' && <p className="dica">O motorista não pôde aceitar desta vez. Busque outra carona.</p>}
            {carona.status === 'ABERTA' && meuPedido.status !== 'RECUSADA' && (
              <button className="btn pequeno contorno vermelho" onClick={() => executar('cancelar_pedido')}>Cancelar meu pedido</button>
            )}
          </div>
        )}

        {/* ---------- Passageiro: pedir vaga ---------- */}
        {podeSolicitar && (
          <div className="cartao">
            <h3>🙋 Solicitar vaga</h3>
            <div className="campo-icone">
              <span className="ponto-origem"></span>
              <input id="ponto" placeholder="Ponto de embarque" value={pontoEmbarque} onChange={(e) => setPontoEmbarque(e.target.value)} />
            </div>
            <div className="campo">
              <textarea id="mensagem" placeholder="Mensagem ao motorista (ex.: Tenho aula às 19h.)" value={recado} onChange={(e) => setRecado(e.target.value)} />
            </div>
            <button className="btn bloco" id="solicitar" onClick={() => executar('solicitar', { ponto_embarque: pontoEmbarque, mensagem: recado })}>Solicitar carona</button>
          </div>
        )}

        {/* ---------- Divisão do custo ---------- */}
        <div className="rateio" style={{ marginBottom: 12 }}>
          <b>💰 Divisão do custo</b>
          <div className="linha"><span>Distância</span><span>{numero(carona.distancia)} km</span></div>
          <div className="linha"><span>Consumo do veículo</span><span>{numero(carona.consumo)} km/l</span></div>
          <div className="linha"><span>Combustível</span><span>{dinheiro(carona.preco_combustivel)}/l</span></div>
          <div className="linha"><span>Custo total</span><span>{dinheiro(carona.custo)}</span></div>
          <div className="linha"><span>{textoPessoas}</span><span>{Math.max(carona.aceitos, 1) + 1}</span></div>
          <div className="linha total"><span>Valor por pessoa</span><span>{dinheiro(carona.valor_atual)}</span></div>
          <p className="dica" style={{ margin: '6px 0 0' }}>Com o carro cheio ({carona.vagas + 1} pessoas): {dinheiro(carona.valor_carro_cheio)}. Pagamento combinado entre os participantes (ex.: Pix).</p>
        </div>

        {/* ---------- Motorista: concluir ou cancelar ---------- */}
        {souMotorista && carona.status === 'ABERTA' && (
          <div className="acoes" style={{ marginBottom: 12 }}>
            <button className="btn" id="concluir" style={{ flex: 1 }} onClick={() => executar('concluir')}>✔ Concluir viagem</button>
            <button className="btn contorno vermelho" onClick={() => executar('cancelar_carona')}>Cancelar</button>
          </div>
        )}

        {dados.participei && (
          <p className="centro"><Link to={'/denunciar/' + carona.id} style={{ color: 'var(--vermelho)' }}>🚩 Denunciar um problema</Link></p>
        )}
      </div>
    </>
  )
}
