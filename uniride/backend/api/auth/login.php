<?php
// POST: faz o login com e-mail e senha
require_once '../../config/api.php';

$dados = dadosRecebidos();
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';

$sql = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$sql->execute([$email]);
$usuario = $sql->fetch();

// Confere a senha digitada com a senha criptografada do banco
if (!$usuario || !password_verify($senha, $usuario['senha'])) {
    erro('E-mail ou senha incorretos.', 401);
}

$_SESSION['usuario_id'] = $usuario['id'];
responder(['usuario' => ['id' => (int) $usuario['id'], 'nome' => $usuario['nome'], 'email' => $usuario['email']]]);
