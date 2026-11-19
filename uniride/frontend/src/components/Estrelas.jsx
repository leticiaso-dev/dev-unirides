// Mostra a nota em estrelas: 4.6 -> ★★★★★ 4,6
export default function Estrelas({ media }) {
  if (media === null || media === undefined) {
    return <span className="dica">Sem avaliações</span>
  }
  const cheias = Math.round(media)
  return (
    <span>
      <span className="estrelas">{'★'.repeat(cheias) + '☆'.repeat(5 - cheias)}</span>{' '}
      <b>{Number(media).toFixed(1).replace('.', ',')}</b>
    </span>
  )
}
