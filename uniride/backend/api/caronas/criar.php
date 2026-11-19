<?php
// POST: o motorista oferece uma nova carona
require_once '../../config/api.php';

$id = usuarioLogado();
$dados = dadosRecebidos();

$veiculo_id  = $dados['veiculo_id'] ?? 0;
$origem      = trim($dados['origem'] ?? '');
$destino     = trim($dados['destino'] ?? '');
$data        = $dados['data'] ?? '';
$hora        = $dados['hora'] ?? '';
$distancia   = (float) ($dados['distancia'] ?? 0);
$preco       = (float) ($dados['preco_combustivel'] ?? 0);
$vagas       = (int) ($dados['vagas'] ?? 0);
$observacoes = trim($dados['observacoes'] ?? '');
$data_hora   = "$data $hora";

// Confere se o veículo é mesmo do usuário
$sql = $pdo->prepare('SELECT * FROM veiculos WHERE id = ? AND usuario_id = ?');
$sql->execute([$veiculo_id, $id]);
$veiculo = $sql->fetch();

if (!$veiculo) {
    erro('Selecione um veículo cadastrado.');
}
if ($origem == '' || $destino == '' || $data == '' || $hora == '') {
    erro('Informe origem, destino, data e horário.');
}
if (strtotime($data_hora) < time()) {
    erro('A data e o horário de saída devem ser no futuro.');
}
if ($distancia <= 0 || $preco <= 0) {
    erro('Informe a distância e o preço do combustível.');
}
if ($vagas < 1 || $vagas > $veiculo['lugares']) {
    erro('O número de vagas deve ser de 1 a ' . $veiculo['lugares'] . ' (lugares do veículo).');
}

$sql = $pdo->prepare('INSERT INTO caronas (motorista_id, veiculo_id, origem, destino, data_hora, distancia, preco_combustivel, vagas, observacoes)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
$sql->execute([$id, $veiculo_id, $origem, $destino, $data_hora, $distancia, $preco, $vagas, $observacoes]);

responder(['id' => (int) $pdo->lastInsertId()], 201);
