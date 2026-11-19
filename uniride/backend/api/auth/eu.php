<?php
// GET: retorna os dados do usuário logado (o React usa para saber se há alguém logado)
require_once '../../config/api.php';

$id = usuarioLogado();

$sql = $pdo->prepare('SELECT id, nome, email, vinculo, curso_setor, telefone FROM usuarios WHERE id = ?');
$sql->execute([$id]);
$usuario = $sql->fetch();

if (!$usuario) {
    erro('Usuário não encontrado.', 401);
}
$usuario['id'] = (int) $usuario['id'];
responder(['usuario' => $usuario]);
