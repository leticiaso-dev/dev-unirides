// Função para conversar com a API PHP.
// Exemplo GET:  await api('caronas/buscar.php?origem=Jabaquara')
// Exemplo POST: await api('auth/login.php', { email, senha })

export async function api(caminho, dados) {
  const opcoes = {
    method: dados ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // envia o cookie da sessão de login
  }
  if (dados) {
    opcoes.body = JSON.stringify(dados)
  }

  const resposta = await fetch('/api/' + caminho, opcoes)
  const json = await resposta.json()

  // Se a API respondeu com erro, lança o erro com a mensagem do PHP
  if (!resposta.ok) {
    throw new Error(json.erro || 'Não foi possível concluir a operação.')
  }
  return json
}
