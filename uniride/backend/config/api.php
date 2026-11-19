<?php
// Arquivo incluído no início de todos os arquivos da API.
// Configura a resposta em JSON, a sessão de login e as funções comuns.

session_start();
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexao.php';

// Envia a resposta em JSON e encerra
function responder($dados, $status = 200)
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// Envia uma mensagem de erro em JSON e encerra
function erro($mensagem, $status = 400)
{
    responder(['erro' => $mensagem], $status);
}

// Lê os dados enviados pelo React (corpo da requisição em JSON)
function dadosRecebidos()
{
    $dados = json_decode(file_get_contents('php://input'), true);
    return $dados ?? [];
}

// Retorna o id do usuário logado ou responde com erro 401
function usuarioLogado()
{
    if (!isset($_SESSION['usuario_id'])) {
        erro('Faça login para continuar.', 401);
    }
    return $_SESSION['usuario_id'];
}

// Aceita somente e-mails de domínio acadêmico (ex.: @senacsp.edu.br)
function emailInstitucional($email)
{
    $email = strtolower($email);
    return str_ends_with($email, '.edu.br') || str_ends_with($email, 'senac.br');
}

// Média das notas recebidas por um usuário
function notaMedia($pdo, $usuarioId)
{
    $sql = $pdo->prepare('SELECT AVG(nota) AS media, COUNT(*) AS total FROM avaliacoes WHERE avaliado_id = ?');
    $sql->execute([$usuarioId]);
    $nota = $sql->fetch();
    return [
        'media' => $nota['media'] === null ? null : round((float) $nota['media'], 1),
        'total' => (int) $nota['total'],
    ];
}

// Quantos passageiros já foram aceitos em uma carona
function passageirosAceitos($pdo, $caronaId)
{
    $sql = $pdo->prepare("SELECT COUNT(*) FROM solicitacoes WHERE carona_id = ? AND status = 'ACEITA'");
    $sql->execute([$caronaId]);
    return (int) $sql->fetchColumn();
}

// REGRA DO RATEIO (sem lucro para o motorista):
// custo da viagem = (distância / consumo) x preço do litro
// valor por pessoa = custo da viagem / (passageiros + motorista)
function custoViagem($distancia, $consumo, $preco)
{
    return round(($distancia / $consumo) * $preco, 2);
}

function valorPorPessoa($custo, $passageiros)
{
    return round($custo / ($passageiros + 1), 2);
}

// Acrescenta à carona os dados calculados que o React mostra na tela
function completarCarona($pdo, $carona)
{
    $aceitos = passageirosAceitos($pdo, $carona['id']);
    $custo = custoViagem($carona['distancia'], $carona['consumo'], $carona['preco_combustivel']);

    $carona['distancia'] = (float) $carona['distancia'];
    $carona['consumo'] = (float) $carona['consumo'];
    $carona['preco_combustivel'] = (float) $carona['preco_combustivel'];
    $carona['vagas'] = (int) $carona['vagas'];
    $carona['aceitos'] = $aceitos;
    $carona['vagas_livres'] = $carona['vagas'] - $aceitos;
    $carona['custo'] = $custo;
    $carona['valor_atual'] = valorPorPessoa($custo, max($aceitos, 1));
    $carona['valor_carro_cheio'] = valorPorPessoa($custo, $carona['vagas']);
    $carona['nota_motorista'] = notaMedia($pdo, $carona['motorista_id']);
    return $carona;
}

// Consulta base das caronas, com motorista e veículo
$SQL_CARONA = 'SELECT c.*, u.nome AS motorista, u.vinculo, u.curso_setor, v.modelo, v.cor, v.placa, v.consumo
               FROM caronas c
               JOIN usuarios u ON u.id = c.motorista_id
               JOIN veiculos v ON v.id = c.veiculo_id';
