<?php
// POST: registra uma denúncia para a equipe de segurança da universidade
require_once '../../config/api.php';

$id = usuarioLogado();
$dados = dadosRecebidos();
$descricao = trim($dados['descricao'] ?? '');

if (strlen($descricao) < 10) {
    erro('Descreva o ocorrido com pelo menos 10 caracteres.');
}

$sql = $pdo->prepare('INSERT INTO denuncias (carona_id, denunciante_id, denunciado_id, motivo, descricao) VALUES (?, ?, ?, ?, ?)');
$sql->execute([$dados['carona_id'], $id, $dados['denunciado_id'], $dados['motivo'], $descricao]);
responder(['mensagem' => 'Denúncia registrada. A equipe de segurança da universidade será notificada.'], 201);
