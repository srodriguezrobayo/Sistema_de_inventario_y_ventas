<?php
declare(strict_types=1);

require_once __DIR__ . '/../../app/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método no permitido.');
}

\App\Core\Session::destroy();
header('Location: /Login.html', true, 303);
exit;