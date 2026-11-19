<?php
// POST: encerra a sessão
require_once '../../config/api.php';

session_destroy();
responder(['ok' => true]);
