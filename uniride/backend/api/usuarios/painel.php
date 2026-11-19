<?php
// GET: dados da tela inicial (painel) do usuário logado
require_once '../../config/api.php';

$id = usuarioLogado();

// Caronas abertas que eu ofereci (como motorista)
$sql = $pdo->prepare("SELECT * FROM caronas WHERE motorista_id = ? AND status = 'ABERTA' ORDER BY data_hora");
$sql->execute([$id]);
$comoMotorista = $sql->fetchAll();

$pedidosPendentes = 0;
foreach ($comoMotorista as $i => $c) {
    $sql = $pdo->prepare("SELECT COUNT(*) FROM solicitacoes WHERE carona_id = ? AND status = 'PENDENTE'");
    $sql->execute([$c['id']]);
    $comoMotorista[$i]['pendentes'] = (int) $sql->fetchColumn();
    $comoMotorista[$i]['aceitos'] = passageirosAceitos($pdo, $c['id']);
    $pedidosPendentes += $comoMotorista[$i]['pendentes'];
}

// Caronas abertas que eu pedi (como passageiro)
$sql = $pdo->prepare("SELECT c.*, s.status AS meu_pedido, u.nome AS motorista
                      FROM solicitacoes s
                      JOIN caronas c ON c.id = s.carona_id
                      JOIN usuarios u ON u.id = c.motorista_id
                      WHERE s.passageiro_id = ? AND c.status = 'ABERTA' AND s.status IN ('PENDENTE', 'ACEITA')
                      ORDER BY c.data_hora");
$sql->execute([$id]);
$comoPassageiro = $sql->fetchAll();

// Viagens concluídas das quais participei
$sql = $pdo->prepare("SELECT DISTINCT c.* FROM caronas c
                      LEFT JOIN solicitacoes s ON s.carona_id = c.id
                      WHERE c.status = 'CONCLUIDA'
                        AND (c.motorista_id = ? OR (s.passageiro_id = ? AND s.status = 'ACEITA'))
                      ORDER BY c.data_hora DESC");
$sql->execute([$id, $id]);
$concluidas = $sql->fetchAll();

// Das concluídas, quais eu ainda não avaliei
$paraAvaliar = [];
foreach ($concluidas as $c) {
    $sql = $pdo->prepare('SELECT COUNT(*) FROM avaliacoes WHERE carona_id = ? AND avaliador_id = ?');
    $sql->execute([$c['id'], $id]);
    if ($sql->fetchColumn() == 0) {
        $paraAvaliar[] = $c;
    }
}

responder([
    'nota' => notaMedia($pdo, $id),
    'totalViagens' => count($concluidas),
    'pedidosPendentes' => $pedidosPendentes,
    'paraAvaliar' => $paraAvaliar,
    'comoMotorista' => $comoMotorista,
    'comoPassageiro' => $comoPassageiro,
]);
