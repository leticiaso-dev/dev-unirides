import { NavLink } from 'react-router-dom'

// Menu fixo na parte de baixo da tela (estilo aplicativo de celular).
// O NavLink coloca a classe "active" sozinho no item da página atual.
export default function MenuInferior() {
  return (
    <nav className="menu-inferior">
      <NavLink to="/painel"><span className="emoji">🏠</span>Início</NavLink>
      <NavLink to="/buscar"><span className="emoji">🔍</span>Buscar</NavLink>
      <NavLink to="/oferecer"><span className="emoji">🚗</span>Oferecer</NavLink>
      <NavLink to="/minhas-caronas"><span className="emoji">🧾</span>Viagens</NavLink>
      <NavLink to="/perfil" end><span className="emoji">👤</span>Perfil</NavLink>
    </nav>
  )
}
