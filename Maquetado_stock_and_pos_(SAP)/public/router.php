<?php
declare(strict_types=1);

$requestPath = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));

if ($requestPath === '/' || $requestPath === '') {
    header('Location: /Login.html', true, 302);
    exit;
}

if ($requestPath === '/router.php') {
    http_response_code(404);
    exit;
}

$page = ltrim($requestPath, '/');
if (str_contains($page, '/') || strtolower(pathinfo($page, PATHINFO_EXTENSION)) !== 'html') {
    return false;
}

$pagePath = __DIR__ . DIRECTORY_SEPARATOR . $page;
if (!is_file($pagePath)) {
    return false;
}

require_once dirname(__DIR__) . '/app/bootstrap.php';

$publicPages = ['Login.html', 'Register.html', 'Terms_conditions.html', 'Forgot_password.html', 'Reset_password.html'];
if (!in_array($page, $publicPages, true) && !\App\Core\Session::isAuthenticated()) {
    header('Location: /Login.html', true, 302);
    exit;
}

if (PHP_SAPI === 'cli-server') {
    return false;
}

header('Content-Type: text/html; charset=utf-8');
readfile($pagePath);