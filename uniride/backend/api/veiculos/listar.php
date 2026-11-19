<?php
// GET: veículos do usuário logado
require_once '../../config/api.php';

$id = usuarioLogado();
$sql = $pdo->prepare('SELECT * FROM veiculos WHERE usuario_id = ?');
$sql->execute([$id]);

$veiculos = $sql->fetchAll();
foreach ($veiculos as $i => $v) {
    $veiculos[$i]['consumo'] = (float) $v['consumo'];
    $veiculos[$i]['lugares'] = (int) $v['lugares'];
}
responder(['veiculos' => $veiculos]);
