import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import MenuInferior from './components/MenuInferior.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Painel from './pages/Painel.jsx'
import Buscar from './pages/Buscar.jsx'
import Oferecer from './pages/Oferecer.jsx'
import Carona from './pages/Carona.jsx'
import Denunciar from './pages/Denunciar.jsx'
import MinhasCaronas from './pages/MinhasCaronas.jsx'
import Perfil from './pages/Perfil.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(null)       // usuário logado (null = ninguém)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  // Ao abrir o site, pergunta para a API se já existe alguém logado
  useEffect(() => {
    async function verificarLogin() {
      try {
        const dados = await api('auth/eu.php')
        setUsuario(dados.usuario)
      } catch (erro) {
        setUsuario(null)
      }
      setCarregando(false)
    }
    verificarLogin()
  }, [])

  async function sair() {
    await api('auth/logout.php', {})
    setUsuario(null)
    navigate('/login')
  }

  if (carregando) {
    return <div className="tela"><p className="conteudo">Carregando...</p></div>
  }

  // Páginas públicas (sem menu inferior)
  function paginaPublica(pagina) {
    return <div className="tela sem-menu">{pagina}</div>
  }

  // Páginas internas: só abrem se o usuário estiver logado
  function paginaLogada(pagina) {
    if (usuario === null) {
      return <Navigate to="/login" />
    }
    return (
      <div className="tela">
        {pagina}
        <MenuInferior />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={usuario ? <Navigate to="/painel" /> : paginaPublica(<Inicio />)} />
      <Route path="/login" element={paginaPublica(<Login setUsuario={setUsuario} />)} />
      <Route path="/cadastro" element={paginaPublica(<Cadastro setUsuario={setUsuario} />)} />
      <Route path="/painel" element={paginaLogada(<Painel usuario={usuario} sair={sair} />)} />
      <Route path="/buscar" element={paginaLogada(<Buscar />)} />
      <Route path="/oferecer" element={paginaLogada(<Oferecer />)} />
      <Route path="/carona/:id" element={paginaLogada(<Carona />)} />
      <Route path="/denunciar/:id" element={paginaLogada(<Denunciar />)} />
      <Route path="/minhas-caronas" element={paginaLogada(<MinhasCaronas />)} />
      <Route path="/perfil" element={paginaLogada(<Perfil sair={sair} />)} />
      <Route path="/perfil/:id" element={paginaLogada(<Perfil sair={sair} />)} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
