<?php
// GET: perfil de um usuário (?id=5). Sem id, retorna o perfil do usuário logado.
require_once '../../config/api.php';

$meuId = usuarioLogado();
$perfilId = (int) ($_GET['id'] ?? $meuId);

$sql = $pdo->prepare('SELECT id, nome, email, vinculo, curso_setor, telefone FROM usuarios WHERE id = ?');
$sql->execute([$perfilId]);
$usuario = $sql->fetch();
if (!$usuario) {
    erro('Usuário não encontrado.', 404);
}

// E-mail e telefone só aparecem no meu próprio perfil (privacidade - LGPD)
$meuPerfil = ($perfilId == $meuId);
if (!$meuPerfil) {
    unset($usuario['email'], $usuario['telefone']);
}

$sql = $pdo->prepare('SELECT a.nota, a.comentario, u.nome AS avaliador
                      FROM avaliacoes a JOIN usuarios u ON u.id = a.avaliador_id
                      WHERE a.avaliado_id = ? ORDER BY a.id DESC');
$sql->execute([$perfilId]);

responder([
    'usuario' => $usuario,
    'meuPerfil' => $meuPerfil,
    'nota' => notaMedia($pdo, $perfilId),
    'avaliacoes' => $sql->fetchAll(),
]);
