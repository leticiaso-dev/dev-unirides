<?php
// POST: remove um veículo do usuário logado
require_once '../../config/api.php';

$id = usuarioLogado();
$dados = dadosRecebidos();
$veiculoId = (int) ($dados['veiculo_id'] ?? 0);

// Não deixa remover se o veículo estiver em uma carona aberta
$sql = $pdo->prepare("SELECT COUNT(*) FROM caronas WHERE veiculo_id = ? AND status = 'ABERTA'");
$sql->execute([$veiculoId]);
if ($sql->fetchColumn() > 0) {
    erro('Este veículo está em uma carona aberta e não pode ser removido.');
}

$pdo->prepare('DELETE FROM veiculos WHERE id = ? AND usuario_id = ?')->execute([$veiculoId, $id]);
responder(['mensagem' => 'Veículo removido.']);
