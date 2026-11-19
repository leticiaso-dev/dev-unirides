import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import Mapa from '../components/Mapa.jsx'

export default function Cadastro({ setUsuario }) {
  // Um estado para cada campo do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [vinculo, setVinculo] = useState('ALUNO')
  const [telefone, setTelefone] = useState('')
  const [cursoSetor, setCursoSetor] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [aceite, setAceite] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function cadastrar(evento) {
    evento.preventDefault()
    if (senha !== confirmar) {
      setErro('As senhas não conferem.')
      return
    }
    try {
      const dados = await api('auth/cadastro.php', {
        nome: nome,
        email: email,
        vinculo: vinculo,
        telefone: telefone,
        curso_setor: cursoSetor,
        senha: senha,
        aceite: aceite,
      })
      setUsuario(dados.usuario)
      navigate('/painel')
    } catch (e) {
      setErro(e.message)
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <Mapa voltar altura={150} />
      <div className="painel">
        <h1>Criar conta</h1>
        <p className="dica">Exclusivo para alunos, professores e funcionários. Use seu e-mail institucional.</p>

        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={cadastrar}>
          <div className="campo"><label htmlFor="nome">Nome completo</label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
          <div className="campo"><label htmlFor="email">E-mail institucional</label>
            <input id="email" type="email" placeholder="seu.nome@senacsp.edu.br" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="linha-campos">
            <div className="campo"><label htmlFor="vinculo">Vínculo</label>
              <select id="vinculo" value={vinculo} onChange={(e) => setVinculo(e.target.value)}>
                <option value="ALUNO">Aluno(a)</option>
                <option value="PROFESSOR">Professor(a)</option>
                <option value="FUNCIONARIO">Funcionário(a)</option>
              </select></div>
            <div className="campo"><label htmlFor="telefone">Celular</label>
              <input id="telefone" placeholder="(11) 90000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} /></div>
          </div>
          <div className="campo"><label htmlFor="curso_setor">Curso ou setor</label>
            <input id="curso_setor" placeholder="Ex.: Análise e Desenvolvimento de Sistemas" value={cursoSetor} onChange={(e) => setCursoSetor(e.target.value)} required /></div>
          <div className="linha-campos">
            <div className="campo"><label htmlFor="senha">Senha</label>
              <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required /></div>
            <div className="campo"><label htmlFor="confirmar">Confirmar</label>
              <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required /></div>
          </div>

          <div className="cartao" style={{ background: '#e8f5f0', border: 'none' }}>
            <h3>Regras de convivência</h3>
            <p className="dica">1. O valor da carona serve só para dividir o combustível, sem lucro.<br />
              2. Respeite o horário combinado.<br />
              3. Assédio ou direção perigosa geram suspensão.<br />
              4. Use "Denunciar" para relatar problemas à segurança da universidade.</p>
          </div>
          <label className="check">
            <input type="checkbox" id="aceite" checked={aceite} onChange={() => setAceite(!aceite)} />
            Li e aceito as regras de convivência.
          </label>
          <button className="btn bloco" type="submit">Criar conta</button>
        </form>
        <p className="centro dica" style={{ marginTop: 14 }}>Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </>
  )
}
