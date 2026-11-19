<?php
// Conexão com o banco de dados MySQL usando PDO.
// No XAMPP, o usuário padrão é "root" e a senha é vazia.

$host    = 'localhost';
$banco   = 'uniride';
$usuario = 'root';
$senha   = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8mb4", $usuario, $senha);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);        // mostra erros do banco
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);   // resultados como array
} catch (PDOException $erro) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['erro' => 'Erro ao conectar com o banco. Verifique se o MySQL está ligado no XAMPP e se o banco "uniride" foi importado.']);
    exit;
}
