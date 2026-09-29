<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_post();

$email = strtolower(trim((string) ($_POST['email'] ?? '')));
$password = (string) ($_POST['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    redirect_auth('Login.html', 'credentials');
}

$database = auth_database();
try {
    $statement = $database->prepare(
        'SELECT Id_usuario, Nombre_usuario, Contrasena_usuario FROM Usuarios WHERE Email_usuario = ? AND Estado_usuario = 1 LIMIT 1'
    );
    $statement->bind_param('s', $email);
    $statement->execute();
    $user = $statement->get_result()->fetch_assoc();
} catch (mysqli_sql_exception $exception) {
    error_log($exception->getMessage());
    redirect_auth('Login.html', 'database');
}

if (!$user || !password_verify($password, $user['Contrasena_usuario'])) {
    redirect_auth('Login.html', 'credentials');
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['Id_usuario'];
$_SESSION['user_name'] = $user['Nombre_usuario'];
redirect_auth('main.html');