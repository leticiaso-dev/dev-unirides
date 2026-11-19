<?php
// POST: cria a conta de um novo usuário
require_once '../../config/api.php';

$dados = dadosRecebidos();
$nome        = trim($dados['nome'] ?? '');
$email       = strtolower(trim($dados['email'] ?? ''));
$vinculo     = $dados['vinculo'] ?? 'ALUNO';
$curso_setor = trim($dados['curso_setor'] ?? '');
$telefone    = trim($dados['telefone'] ?? '');
$senha       = $dados['senha'] ?? '';

// Validações
if ($nome == '' || $email == '' || $curso_setor == '' || $senha == '') {
    erro('Preencha todos os campos obrigatórios.');
}
if (!emailInstitucional($email)) {
    erro('Use o seu e-mail institucional (terminado em .edu.br). E-mails pessoais não são aceitos.');
}
if (strlen($senha) < 6) {
    erro('A senha deve ter pelo menos 6 caracteres.');
}
if (empty($dados['aceite'])) {
    erro('É necessário aceitar as regras de convivência.');
}

// Verifica se o e-mail já existe
$sql = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
$sql->execute([$email]);
if ($sql->fetch()) {
    erro('Este e-mail já está cadastrado.');
}

// Salva com a senha criptografada
$sql = $pdo->prepare('INSERT INTO usuarios (nome, email, senha, vinculo, curso_setor, telefone) VALUES (?, ?, ?, ?, ?, ?)');
$sql->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT), $vinculo, $curso_setor, $telefone]);

// Já deixa o usuário logado
$_SESSION['usuario_id'] = $pdo->lastInsertId();
responder(['usuario' => ['id' => (int) $_SESSION['usuario_id'], 'nome' => $nome, 'email' => $email]], 201);
