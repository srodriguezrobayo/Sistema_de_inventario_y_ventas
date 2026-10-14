
<?php

require_once __DIR__ . '/../Back_end/Controlador/ValidarSesion.php';

$pagina = basename($_GET['pagina'] ?? 'Main.html');

if (
    !preg_match('/^[a-zA-Z0-9_-]+\.html$/i', $pagina) ||
    strtolower($pagina) === 'login.html' ||
    !is_file(__DIR__ . '/' . $pagina)
) {
    http_response_code(404);
    exit('Página no encontrada.');
}

readfile(__DIR__ . '/' . $pagina);
