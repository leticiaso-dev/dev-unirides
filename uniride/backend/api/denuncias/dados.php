<?php
// GET: informações para montar o formulário de denúncia (?carona=3)
require_once '../../config/api.php';

$id = usuarioLogado();
$caronaId = (int) ($_GET['carona'] ?? 0);

$sql = $pdo->prepare('SELECT c.*, u.nome AS motorista FROM caronas c JOIN usuarios u ON u.id = c.motorista_id WHERE c.id = ?');
$sql->execute([$caronaId]);
$carona = $sql->fetch();
if (!$carona) {
    erro('Carona não encontrada.', 404);
}

// Se sou o motorista, posso denunciar os passageiros; se sou passageiro, o motorista
if ($carona['motorista_id'] == $id) {
    $sql = $pdo->prepare("SELECT u.id, u.nome FROM solicitacoes s JOIN usuarios u ON u.id = s.passageiro_id
                          WHERE s.carona_id = ? AND s.status = 'ACEITA'");
    $sql->execute([$caronaId]);
    $envolvidos = $sql->fetchAll();
} else {
    $envolvidos = [['id' => $carona['motorista_id'], 'nome' => $carona['motorista']]];
}

responder([
    'carona' => $carona,
    'envolvidos' => $envolvidos,
    'motivos' => ['Comportamento inadequado', 'Direção perigosa', 'Não compareceu', 'Cobrança indevida', 'Assédio', 'Outro'],
]);
