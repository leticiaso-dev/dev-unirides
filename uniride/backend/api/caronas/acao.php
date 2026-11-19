<?php
// POST: ações na tela de detalhes da carona.
// O React envia: { carona_id, acao, ...outros campos }
// Ações: solicitar, cancelar_pedido, aceitar, recusar, concluir, cancelar_carona, avaliar
require_once '../../config/api.php';

$id = usuarioLogado();
$dados = dadosRecebidos();
$caronaId = (int) ($dados['carona_id'] ?? 0);
$acao = $dados['acao'] ?? '';

$sql = $pdo->prepare('SELECT * FROM caronas WHERE id = ?');
$sql->execute([$caronaId]);
$carona = $sql->fetch();
if (!$carona) {
    erro('Carona não encontrada.', 404);
}
$souMotorista = ($carona['motorista_id'] == $id);

// ---------- Passageiro pede uma vaga ----------
if ($acao == 'solicitar') {
    if ($souMotorista || $carona['status'] != 'ABERTA') {
        erro('Não é possível solicitar esta carona.');
    }
    if (passageirosAceitos($pdo, $caronaId) >= $carona['vagas']) {
        erro('Não há mais vagas nesta carona.');
    }
    if (trim($dados['ponto_embarque'] ?? '') == '') {
        erro('Informe o ponto de embarque.');
    }
    // Se já tinha cancelado um pedido antes, apaga o antigo
    $pdo->prepare("DELETE FROM solicitacoes WHERE carona_id = ? AND passageiro_id = ? AND status = 'CANCELADA'")->execute([$caronaId, $id]);

    $sql = $pdo->prepare('SELECT id FROM solicitacoes WHERE carona_id = ? AND passageiro_id = ?');
    $sql->execute([$caronaId, $id]);
    if ($sql->fetch()) {
        erro('Você já solicitou esta carona.');
    }
    $sql = $pdo->prepare('INSERT INTO solicitacoes (carona_id, passageiro_id, ponto_embarque, mensagem) VALUES (?, ?, ?, ?)');
    $sql->execute([$caronaId, $id, trim($dados['ponto_embarque']), trim($dados['mensagem'] ?? '')]);
    responder(['mensagem' => 'Pedido enviado ao motorista!']);
}

// ---------- Passageiro cancela o próprio pedido ----------
if ($acao == 'cancelar_pedido') {
    $pdo->prepare("UPDATE solicitacoes SET status = 'CANCELADA' WHERE carona_id = ? AND passageiro_id = ?")->execute([$caronaId, $id]);
    responder(['mensagem' => 'Pedido cancelado.']);
}

// ---------- Motorista aceita ou recusa um pedido ----------
if ($acao == 'aceitar' || $acao == 'recusar') {
    if (!$souMotorista) {
        erro('Apenas o motorista pode responder aos pedidos.', 403);
    }
    if ($acao == 'aceitar' && passageirosAceitos($pdo, $caronaId) >= $carona['vagas']) {
        erro('Todas as vagas já foram preenchidas.');
    }
    $novoStatus = ($acao == 'aceitar') ? 'ACEITA' : 'RECUSADA';
    $sql = $pdo->prepare("UPDATE solicitacoes SET status = ? WHERE id = ? AND carona_id = ? AND status = 'PENDENTE'");
    $sql->execute([$novoStatus, $dados['solicitacao_id'] ?? 0, $caronaId]);
    responder(['mensagem' => $acao == 'aceitar' ? 'Passageiro aceito!' : 'Pedido recusado.']);
}

// ---------- Motorista conclui ou cancela a viagem ----------
if ($acao == 'concluir' || $acao == 'cancelar_carona') {
    if (!$souMotorista || $carona['status'] != 'ABERTA') {
        erro('Não é possível alterar esta carona.', 403);
    }
    if ($acao == 'concluir') {
        $pdo->prepare("UPDATE caronas SET status = 'CONCLUIDA' WHERE id = ?")->execute([$caronaId]);
        $pdo->prepare("UPDATE solicitacoes SET status = 'RECUSADA' WHERE carona_id = ? AND status = 'PENDENTE'")->execute([$caronaId]);
        responder(['mensagem' => 'Viagem concluída! Agora avalie os participantes.']);
    }
    $pdo->prepare("UPDATE caronas SET status = 'CANCELADA' WHERE id = ?")->execute([$caronaId]);
    $pdo->prepare("UPDATE solicitacoes SET status = 'CANCELADA' WHERE carona_id = ?")->execute([$caronaId]);
    responder(['mensagem' => 'Carona cancelada.']);
}

// ---------- Avaliação depois da viagem ----------
if ($acao == 'avaliar') {
    $nota = (int) ($dados['nota'] ?? 0);
    if ($carona['status'] != 'CONCLUIDA') {
        erro('Só é possível avaliar depois da viagem concluída.');
    }
    if ($nota < 1 || $nota > 5) {
        erro('Escolha uma nota de 1 a 5 estrelas.');
    }
    $sql = $pdo->prepare('SELECT COUNT(*) FROM avaliacoes WHERE carona_id = ? AND avaliador_id = ? AND avaliado_id = ?');
    $sql->execute([$caronaId, $id, $dados['avaliado_id'] ?? 0]);
    if ($sql->fetchColumn() > 0) {
        erro('Você já avaliou esta pessoa nesta viagem.');
    }
    $sql = $pdo->prepare('INSERT INTO avaliacoes (carona_id, avaliador_id, avaliado_id, nota, comentario) VALUES (?, ?, ?, ?, ?)');
    $sql->execute([$caronaId, $id, $dados['avaliado_id'], $nota, trim($dados['comentario'] ?? '')]);
    responder(['mensagem' => 'Avaliação enviada. Obrigado!']);
}

erro('Ação inválida.');
