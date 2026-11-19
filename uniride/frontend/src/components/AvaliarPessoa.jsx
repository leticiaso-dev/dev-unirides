import { useState } from 'react'

// Formulário para avaliar uma pessoa depois da viagem.
// Cada pessoa tem o seu próprio formulário, com a sua nota e o seu comentário.
export default function AvaliarPessoa({ pessoa, papel, enviar }) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')

  return (
    <div className="pessoa" style={{ display: 'block' }}>
      <p style={{ margin: '0 0 6px' }}><b>{pessoa.nome}</b> <span className="dica">· {papel}</span></p>
      <div className="campo">
        <select name="nota" value={nota} onChange={(e) => setNota(e.target.value)}>
          <option value="5">★★★★★ (5) Excelente</option>
          <option value="4">★★★★☆ (4) Boa</option>
          <option value="3">★★★☆☆ (3) Regular</option>
          <option value="2">★★☆☆☆ (2) Ruim</option>
          <option value="1">★☆☆☆☆ (1) Péssima</option>
        </select>
      </div>
      <div className="campo">
        <input name="comentario" placeholder="Comentário (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} />
      </div>
      <button className="btn pequeno" onClick={() => enviar(pessoa.id, nota, comentario)}>Enviar avaliação</button>
    </div>
  )
}
