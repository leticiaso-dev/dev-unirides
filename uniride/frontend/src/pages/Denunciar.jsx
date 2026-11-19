import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'

export default function Denunciar() {
  const { id } = useParams()  // id da carona
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [denunciado, setDenunciado] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      const resposta = await api('denuncias/dados.php?carona=' + id)
      setDados(resposta)
      setMotivo(resposta.motivos[0])
      if (resposta.envolvidos.length > 0) {
        setDenunciado(resposta.envolvidos[0].id)
      }
    }
    carregar()
  }, [id])

  async function enviar() {
    try {
      await api('denuncias/criar.php', { carona_id: id, denunciado_id: denunciado, motivo: motivo, descricao: descricao })
      navigate('/carona/' + id)
    } catch (e) {
      setErro(e.message)
    }
  }

  if (dados === null) {
    return <p className="conteudo">Carregando...</p>
  }

  return (
    <>
      <Mapa voltar altura={140} />
      <div className="painel">
        <h1>🚩 Denunciar ocorrência</h1>
        <p className="dica">A denúncia é confidencial e será analisada pela equipe de segurança da universidade.</p>
        {erro && <div className="alerta erro">{erro}</div>}

        <div className="campo">
          <label htmlFor="denunciado">Pessoa envolvida</label>
          <select id="denunciado" value={denunciado} onChange={(e) => setDenunciado(e.target.value)}>
            {dados.envolvidos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="motivo">Motivo</label>
          <select id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
            {dados.motivos.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="descricao">O que aconteceu?</label>
          <textarea id="descricao" placeholder="Descreva o ocorrido com o máximo de detalhes." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <button className="btn bloco vermelho" onClick={enviar}>Enviar denúncia</button>
        <p className="centro" style={{ marginTop: 12 }}><Link to={'/carona/' + id}>Cancelar</Link></p>
      </div>
    </>
  )
}
