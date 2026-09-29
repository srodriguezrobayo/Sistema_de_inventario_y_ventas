<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Session;
use App\Models\User;
use mysqli_sql_exception;

final class AuthController
{
    public function login(): never
    {
        $this->requirePost();

        $email = strtolower(trim((string) ($_POST['email'] ?? '')));
        $password = (string) ($_POST['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            $this->redirect('Login.html', 'credentials');
        }

        try {
            $user = (new User(Database::connection()))->findActiveByEmail($email);
        } catch (mysqli_sql_exception $exception) {
            error_log($exception->getMessage());
            $this->redirect('Login.html', 'database');
        }

        if (!$user || !password_verify($password, $user['Contrasena_usuario'])) {
            $this->redirect('Login.html', 'credentials');
        }

        Session::authenticate((int) $user['Id_usuario'], $user['Nombre_usuario']);
        $this->redirect('main.html');
    }

    public function register(): never
    {
        $this->requirePost();

        $name = trim((string) ($_POST['name'] ?? ''));
        $email = strtolower(trim((string) ($_POST['email'] ?? '')));
        $password = (string) ($_POST['password'] ?? '');
        $passwordConfirm = (string) ($_POST['password_confirm'] ?? '');

        if (!preg_match('/^.{1,100}$/us', $name)) {
            $this->redirect('Register.html', 'name');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 500) {
            $this->redirect('Register.html', 'email');
        }

        if (strlen($password) < 8 || strlen($password) > 72 || $password !== $passwordConfirm) {
            $this->redirect('Register.html', 'password');
        }

        try {
            $users = new User(Database::connection());
            if ($users->existsByEmail($email)) {
                $this->redirect('Register.html', 'duplicate');
            }

            $userId = $users->create($name, $email, password_hash($password, PASSWORD_DEFAULT));
        } catch (mysqli_sql_exception $exception) {
            if ($exception->getCode() === 1062) {
                $this->redirect('Register.html', 'duplicate');
            }

            error_log($exception->getMessage());
            $this->redirect('Register.html', 'database');
        }

        Session::authenticate($userId, $name);
        $this->redirect('main.html');
    }

    private function requirePost(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            header('Allow: POST');
            exit('Método no permitido.');
        }
    }

    private function redirect(string $page, ?string $error = null): never
    {
        $location = '../' . $page;
        if ($error !== null) {
            $location .= '?error=' . rawurlencode($error);
        }

        header('Location: ' . $location, true, 303);
        exit;
    }
}