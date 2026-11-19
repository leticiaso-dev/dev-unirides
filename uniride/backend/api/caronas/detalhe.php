<?php
// GET: todos os dados da tela de detalhes de uma carona (?id=3)
require_once '../../config/api.php';

$id = usuarioLogado();
$caronaId = (int) ($_GET['id'] ?? 0);

$sql = $pdo->prepare($SQL_CARONA . ' WHERE c.id = ?');
$sql->execute([$caronaId]);
$carona = $sql->fetch();
if (!$carona) {
    erro('Carona não encontrada.', 404);
}
$carona = completarCarona($pdo, $carona);
$souMotorista = ($carona['motorista_id'] == $id);

// Meu pedido nesta carona (se eu for passageiro)
$sql = $pdo->prepare('SELECT * FROM solicitacoes WHERE carona_id = ? AND passageiro_id = ?');
$sql->execute([$caronaId, $id]);
$meuPedido = $sql->fetch() ?: null;

// Passageiros confirmados
$sql = $pdo->prepare("SELECT u.id, u.nome, u.vinculo, s.ponto_embarque
                      FROM solicitacoes s JOIN usuarios u ON u.id = s.passageiro_id
                      WHERE s.carona_id = ? AND s.status = 'ACEITA'");
$sql->execute([$caronaId]);
$passageiros = $sql->fetchAll();
foreach ($passageiros as $i => $p) {
    $passageiros[$i]['nota'] = notaMedia($pdo, $p['id']);
}

// Pedidos pendentes (somente o motorista vê)
$pendentes = [];
if ($souMotorista) {
    $sql = $pdo->prepare("SELECT s.*, u.nome, u.vinculo, u.curso_setor
                          FROM solicitacoes s JOIN usuarios u ON u.id = s.passageiro_id
                          WHERE s.carona_id = ? AND s.status = 'PENDENTE'");
    $sql->execute([$caronaId]);
    $pendentes = $sql->fetchAll();
    foreach ($pendentes as $i => $p) {
        $pendentes[$i]['nota'] = notaMedia($pdo, $p['passageiro_id']);
    }
}

// Quem eu ainda posso avaliar (só depois da viagem e se eu participei)
$participei = $souMotorista || ($meuPedido && $meuPedido['status'] == 'ACEITA');
$paraAvaliar = [];
if ($carona['status'] == 'CONCLUIDA' && $participei) {
    $pessoas = $souMotorista ? $passageiros : [['id' => $carona['motorista_id'], 'nome' => $carona['motorista']]];
    foreach ($pessoas as $p) {
        $sql = $pdo->prepare('SELECT COUNT(*) FROM avaliacoes WHERE carona_id = ? AND avaliador_id = ? AND avaliado_id = ?');
        $sql->execute([$caronaId, $id, $p['id']]);
        if ($sql->fetchColumn() == 0) {
            $paraAvaliar[] = ['id' => $p['id'], 'nome' => $p['nome']];
        }
    }
}

responder([
    'carona' => $carona,
    'souMotorista' => $souMotorista,
    'participei' => $participei,
    'meuPedido' => $meuPedido,
    'passageiros' => $passageiros,
    'pendentes' => $pendentes,
    'paraAvaliar' => $paraAvaliar,
]);
