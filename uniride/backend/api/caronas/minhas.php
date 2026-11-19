<?php
// GET: histórico de caronas (?aba=motorista ou ?aba=passageiro)
require_once '../../config/api.php';

$id = usuarioLogado();
$aba = $_GET['aba'] ?? 'motorista';

if ($aba == 'motorista') {
    $sql = $pdo->prepare($SQL_CARONA . ' WHERE c.motorista_id = ? ORDER BY c.data_hora DESC');
} else {
    $sql = $pdo->prepare('SELECT c.*, u.nome AS motorista, u.vinculo, u.curso_setor, v.modelo, v.cor, v.placa, v.consumo, s.status AS meu_pedido
                          FROM solicitacoes s
                          JOIN caronas c ON c.id = s.carona_id
                          JOIN usuarios u ON u.id = c.motorista_id
                          JOIN veiculos v ON v.id = c.veiculo_id
                          WHERE s.passageiro_id = ? ORDER BY c.data_hora DESC');
}
$sql->execute([$id]);

$caronas = [];
foreach ($sql->fetchAll() as $c) {
    $caronas[] = completarCarona($pdo, $c);
}
responder(['caronas' => $caronas]);
