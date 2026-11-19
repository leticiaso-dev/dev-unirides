<?php
// POST: cadastra um veículo para o usuário logado
require_once '../../config/api.php';

$id = usuarioLogado();
$dados = dadosRecebidos();

$modelo  = trim($dados['modelo'] ?? '');
$cor     = trim($dados['cor'] ?? '');
$placa   = strtoupper(trim($dados['placa'] ?? ''));
$consumo = (float) ($dados['consumo'] ?? 0);
$lugares = (int) ($dados['lugares'] ?? 0);

if ($modelo == '' || $cor == '' || $placa == '') {
    erro('Preencha modelo, cor e placa.');
}
if ($consumo <= 0) {
    erro('Informe o consumo médio do veículo em km/l.');
}
if ($lugares < 1 || $lugares > 6) {
    erro('Os lugares livres devem ser de 1 a 6.');
}

$sql = $pdo->prepare('SELECT id FROM veiculos WHERE placa = ?');
$sql->execute([$placa]);
if ($sql->fetch()) {
    erro('Já existe um veículo com esta placa.');
}

$sql = $pdo->prepare('INSERT INTO veiculos (usuario_id, modelo, cor, placa, consumo, lugares) VALUES (?, ?, ?, ?, ?, ?)');
$sql->execute([$id, $modelo, $cor, $placa, $consumo, $lugares]);
responder(['mensagem' => 'Veículo cadastrado! Agora você pode oferecer caronas.'], 201);
