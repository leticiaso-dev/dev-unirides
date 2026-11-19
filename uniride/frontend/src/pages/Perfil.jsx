import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api.js'
import { iniciais, nomeVinculo, numero } from '../utils.js'

export default function Perfil({ sair }) {
  const { id } = useParams()   // sem id = meu perfil; com id = perfil de outra pessoa
  const [dados, setDados] = useState(null)
  const [veiculos, setVeiculos] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  // Campos do formulário de veículo
  const [modelo, setModelo] = useState('')
  const [cor, setCor] = useState('')
  const [placa, setPlaca] = useState('')
  const [consumo, setConsumo] = useState('')
  const [lugares, setLugares] = useState('3')

  async function carregar() {
    let endereco = 'usuarios/perfil.php'
    if (id) {
      endereco = endereco + '?id=' + id
    }
    const resposta = await api(endereco)
    setDados(resposta)
    if (resposta.meuPerfil) {
      const lista = await api('veiculos/listar.php')
      setVeiculos(lista.veiculos)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  async function cadastrarVeiculo() {
    setErro('')
    try {
      const resposta = await api('veiculos/criar.php', { modelo: modelo, cor: cor, placa: placa, consumo: consumo, lugares: lugares })
      setMensagem(resposta.mensagem)
      setModelo(''); setCor(''); setPlaca(''); setConsumo(''); setLugares('3')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function removerVeiculo(veiculoId) {
    try {
      const resposta = await api('veiculos/remover.php', { veiculo_id: veiculoId })
      setMensagem(resposta.mensagem)
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  if (dados === null) {
    return <p className="conteudo">Carregando...</p>
  }

  const usuario = dados.usuario
  let nota = '–'
  if (dados.nota.media !== null) {
    nota = dados.nota.media.toFixed(1).replace('.', ',')
  }

  return (
    <div className="conteudo">
      {mensagem && <div className="alerta sucesso">{mensagem}</div>}

      <div className="centro" style={{ marginBottom: 14 }}>
        <span className="avatar grande">{iniciais(usuario.nome)}</span>
        <h1 style={{ marginTop: 8 }}>{usuario.nome}</h1>
        <span className="etiqueta ABERTA">{nomeVinculo(usuario.vinculo)}</span>
        <p className="dica">{usuario.curso_setor}</p>
      </div>

      <div className="indicadores">
        <div className="indicador"><b>{nota} ★</b><span>Nota média</span></div>
        <div className="indicador"><b>{dados.nota.total}</b><span>Avaliações</span></div>
      </div>

      {dados.meuPerfil && (
        <>
          <p className="dica">E-mail: {usuario.email} · Celular: {usuario.telefone}</p>

          <div className="secao-titulo">🚗 Meus veículos</div>
          {veiculos.length === 0 && <p className="dica">Nenhum veículo cadastrado. Cadastre um para oferecer caronas.</p>}
          {veiculos.map((v) => (
            <div className="cartao" key={v.id}>
              <div className="acoes" style={{ justifyContent: 'space-between' }}>
                <span><b>{v.modelo}</b> {v.cor}<br /><span className="dica">{v.placa} · {numero(v.consumo)} km/l · {v.lugares} lugares</span></span>
                <button className="btn pequeno contorno vermelho" onClick={() => removerVeiculo(v.id)}>Remover</button>
              </div>
            </div>
          ))}

          <div className="cartao">
            <h3>Cadastrar veículo</h3>
            {erro && <div className="alerta erro">{erro}</div>}
            <div className="linha-campos">
              <div className="campo"><input id="modelo" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} /></div>
              <div className="campo"><input id="cor" placeholder="Cor" value={cor} onChange={(e) => setCor(e.target.value)} /></div>
            </div>
            <div className="linha-campos">
              <div className="campo"><input id="placa" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} /></div>
              <div className="campo"><input id="consumo" type="number" placeholder="km/l" value={consumo} onChange={(e) => setConsumo(e.target.value)} /></div>
              <div className="campo"><input id="lugares" type="number" placeholder="Lugares" value={lugares} onChange={(e) => setLugares(e.target.value)} /></div>
            </div>
            <button className="btn bloco" onClick={cadastrarVeiculo}>Salvar veículo</button>
          </div>
        </>
      )}

      <div className="secao-titulo">⭐ Avaliações recebidas</div>
      {dados.avaliacoes.length === 0 && <p className="dica">Ainda não há avaliações.</p>}
      {dados.avaliacoes.map((a, i) => (
        <div className="pessoa" key={i}>
          <span className="avatar">{iniciais(a.avaliador)}</span>
          <div className="info">
            <b>{a.avaliador}</b> <span className="estrelas">{'★'.repeat(a.nota)}</span>
            <small>{a.comentario || 'Sem comentário.'}</small>
          </div>
        </div>
      ))}

      {dados.meuPerfil && (
        <button className="btn bloco contorno" style={{ marginTop: 18 }} onClick={sair}>Sair da conta</button>
      )}
    </div>
  )
}
