<?php
// GET: busca caronas abertas e futuras (?origem=&destino=&data=)
require_once '../../config/api.php';

$id = usuarioLogado();
$origem  = $_GET['origem'] ?? '';
$destino = $_GET['destino'] ?? '';
$data    = $_GET['data'] ?? '';
$lugares = (int) ($_GET['lugares'] ?? 1);  // quantos lugares o passageiro precisa

// Somente caronas abertas, futuras e que não são minhas
$sqlTexto = $SQL_CARONA . " WHERE c.status = 'ABERTA' AND c.data_hora >= ? AND c.motorista_id <> ?";
$parametros = [date('Y-m-d H:i:s'), $id];

if ($origem != '') {
    $sqlTexto .= ' AND c.origem LIKE ?';
    $parametros[] = "%$origem%";
}
if ($destino != '') {
    $sqlTexto .= ' AND c.destino LIKE ?';
    $parametros[] = "%$destino%";
}
if ($data != '') {
    $sqlTexto .= ' AND DATE(c.data_hora) = ?';
    $parametros[] = $data;
}
$sqlTexto .= ' ORDER BY c.data_hora';

$sql = $pdo->prepare($sqlTexto);
$sql->execute($parametros);

$caronas = [];
foreach ($sql->fetchAll() as $c) {
    $c = completarCarona($pdo, $c);
    // só mostra caronas com lugares livres suficientes
    if ($c['vagas_livres'] >= $lugares) {
        $caronas[] = $c;
    }
}
responder(['caronas' => $caronas]);
