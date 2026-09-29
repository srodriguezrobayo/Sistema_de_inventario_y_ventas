<?php
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax',
]);
session_start();

function auth_database(): mysqli
{
    static $connection = null;

    if ($connection instanceof mysqli) {
        return $connection;
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
        $connection = new mysqli(
            getenv('SAP_DB_HOST') ?: '127.0.0.1',
            getenv('SAP_DB_USER') ?: 'root',
            getenv('SAP_DB_PASSWORD') ?: '',
            getenv('SAP_DB_NAME') ?: 'SAP'
        );
        $connection->set_charset('utf8mb4');
    } catch (mysqli_sql_exception $exception) {
        error_log($exception->getMessage());
        http_response_code(503);
        exit('No se pudo conectar con la base de datos. Verifica que MySQL esté iniciado y que exista SAP.');
    }

    return $connection;
}

function require_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        header('Allow: POST');
        exit('Método no permitido.');
    }
}

function redirect_auth(string $page, ?string $error = null): never
{
    $location = '../' . $page;
    if ($error !== null) {
        $location .= '?error=' . rawurlencode($error);
    }

    header('Location: ' . $location, true, 303);
    exit;
}