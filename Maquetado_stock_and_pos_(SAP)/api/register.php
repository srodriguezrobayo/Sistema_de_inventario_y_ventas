<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_post();

$name = trim((string) ($_POST['name'] ?? ''));
$email = strtolower(trim((string) ($_POST['email'] ?? '')));
$password = (string) ($_POST['password'] ?? '');
$passwordConfirm = (string) ($_POST['password_confirm'] ?? '');

if (!preg_match('/^.{1,100}$/us', $name)) {
    redirect_auth('Register.html', 'name');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 500) {
    redirect_auth('Register.html', 'email');
}

if (strlen($password) < 8 || strlen($password) > 72 || $password !== $passwordConfirm) {
    redirect_auth('Register.html', 'password');
}

$database = auth_database();

try {
    $existingUser = $database->prepare('SELECT Id_usuario FROM Usuarios WHERE Email_usuario = ? LIMIT 1');
    $existingUser->bind_param('s', $email);
    $existingUser->execute();
    if ($existingUser->get_result()->fetch_assoc()) {
        redirect_auth('Register.html', 'duplicate');
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $statement = $database->prepare(
        'INSERT INTO Usuarios (Nombre_usuario, Email_usuario, Contrasena_usuario, Estado_usuario) VALUES (?, ?, ?, 1)'
    );
    $statement->bind_param('sss', $name, $email, $passwordHash);
    $statement->execute();

    session_regenerate_id(true);
    $_SESSION['user_id'] = $database->insert_id;
    $_SESSION['user_name'] = $name;
    redirect_auth('main.html');
} catch (mysqli_sql_exception $exception) {
    if ($exception->getCode() === 1062) {
        redirect_auth('Register.html', 'duplicate');
    }

    error_log($exception->getMessage());
    redirect_auth('Register.html', 'database');
}