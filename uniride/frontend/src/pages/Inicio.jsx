import { Link } from 'react-router-dom'
import Mapa from '../components/Mapa.jsx'

// Página inicial (pública)
export default function Inicio() {
  return (
    <>
      <Mapa altura={240} />
      <div className="painel">
        <div className="logo-circulo"><img src="/logo.svg" alt="" width="50" height="50" /></div>
        <div className="marca">
          <h1>UniRide</h1>
          <p>Compartilhe o trajeto</p>
        </div>

        <div className="titulo-centro">
          <h2>Vá para a faculdade com quem vai para o mesmo lugar</h2>
          <p>Caronas entre alunos, professores e funcionários, com custo dividido de forma justa.</p>
        </div>

        <div className="cartao">
          <div className="pessoa"><span className="avatar">1</span><div className="info"><b>Cadastre-se</b><small>Somente com e-mail institucional.</small></div></div>
          <div className="pessoa"><span className="avatar">2</span><div className="info"><b>Busque ou ofereça</b><small>Informe origem, destino e horário.</small></div></div>
          <div className="pessoa"><span className="avatar">3</span><div className="info"><b>Divida o custo</b><small>Só o combustível, sem lucro.</small></div></div>
          <div className="pessoa"><span className="avatar">4</span><div className="info"><b>Avalie</b><small>Motorista e passageiros se avaliam.</small></div></div>
        </div>

        <Link className="btn bloco" to="/cadastro">Criar conta</Link>
        <p className="centro dica" style={{ marginTop: 14 }}>Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </>
  )
}
