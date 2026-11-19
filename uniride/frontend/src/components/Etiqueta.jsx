// Etiqueta colorida de status (ABERTA, PENDENTE, ACEITA...)
const NOMES = {
  ABERTA: 'Aberta',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  PENDENTE: 'Pendente',
  ACEITA: 'Aceita',
  RECUSADA: 'Recusada',
}

export default function Etiqueta({ status }) {
  return <span className={'etiqueta ' + status}>{NOMES[status]}</span>
}
