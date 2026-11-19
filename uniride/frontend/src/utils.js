// Funções de formatação usadas em várias telas

// 6.04 -> "R$ 6,04"
export function dinheiro(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',')
}

// 12.5 -> "12,5"
export function numero(valor) {
  return String(Number(valor)).replace('.', ',')
}

// "2026-11-14 18:10:00" -> "sáb, 14/11 às 18:10"
export function dataHora(texto) {
  const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  const data = new Date(texto.replace(' ', 'T'))
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const hora = texto.substring(11, 16)
  return `${dias[data.getDay()]}, ${dia}/${mes} às ${hora}`
}

// "Lucas Ferreira" -> "LF"
export function iniciais(nome) {
  const partes = nome.split(' ')
  let letras = partes[0][0]
  if (partes.length > 1) {
    letras += partes[partes.length - 1][0]
  }
  return letras.toUpperCase()
}

export function nomeVinculo(vinculo) {
  const nomes = { ALUNO: 'Aluno(a)', PROFESSOR: 'Professor(a)', FUNCIONARIO: 'Funcionário(a)' }
  return nomes[vinculo]
}
