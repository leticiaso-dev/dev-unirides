import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'

export default function Login({ setUsuario }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function entrar(evento) {
    evento.preventDefault()
    try {
      const dados = await api('auth/login.php', { email: email, senha: senha })
      setUsuario(dados.usuario)
      navigate('/painel')
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <Mapa />
      <div className="painel">
        <div className="logo-circulo"><img src="/logo.svg" alt="" width="50" height="50" /></div>
        <div className="marca">
          <h1>UniRide</h1>
          <p>Compartilhe o trajeto</p>
        </div>
        <div className="titulo-centro">
          <h2>Bem-vindo de volta</h2>
          <p>Entre para continuar suas caronas</p>
        </div>

        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={entrar}>
          <div className="campo-icone">
            <span className="icone">✉</span>
            <input id="email" type="email" placeholder="E-mail institucional" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="campo-icone">
            <span className="icone">🔒</span>
            <input id="senha" type={mostrarSenha ? 'text' : 'password'} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <label className="check">
            <input type="checkbox" checked={mostrarSenha} onChange={() => setMostrarSenha(!mostrarSenha)} /> Mostrar senha
          </label>
          <button className="btn bloco" type="submit">Entrar</button>
        </form>

        <p className="centro dica" style={{ marginTop: 14 }}>Não tem conta? <Link to="/cadastro">Criar conta</Link></p>
        <div className="alerta info">
          <b>Contas de teste</b> (senha 123456): lucas@senacsp.edu.br (motorista), camila@senacsp.edu.br (passageira),
          marcos@senacsp.edu.br (funcionário).
        </div>
      </div>
    </>
  )
}
