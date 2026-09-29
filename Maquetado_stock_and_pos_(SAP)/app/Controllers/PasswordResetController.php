<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Models\User;
use App\Services\Mailer;
use mysqli_sql_exception;

final class PasswordResetController
{
    public function handle(): never
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Allow: POST');
            $this->respond(405, ['error' => 'method_not_allowed']);
        }

        $input = json_decode((string) file_get_contents('php://input'), true);
        $input = is_array($input) ? $input : $_POST;

        try {
            $users = new User(Database::connection());
            if (($input['action'] ?? '') === 'request') {
                $this->requestReset($users, (string) ($input['email'] ?? ''));
            }

            if (($input['action'] ?? '') === 'reset') {
                $this->completeReset($users, $input);
            }

            $this->respond(400, ['error' => 'invalid_action']);
        } catch (mysqli_sql_exception $exception) {
            error_log($exception->getMessage());
            $this->respond(500, ['error' => 'request_failed']);
        }
    }

    private function requestReset(User $users, string $email): never
    {
        $email = strtolower(trim($email));
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $userId = $users->activeIdByEmail($email);
            if ($userId !== null && !$users->hasRecentResetRequest($userId) && Mailer::isConfigured()) {
                $token = bin2hex(random_bytes(32));
                $tokenHash = hash('sha256', $token);
                $users->createResetToken($userId, $tokenHash, date('Y-m-d H:i:s', time() + 1800));
                $baseUrl = rtrim(getenv('SAP_APP_URL') ?: 'http://127.0.0.1:8000', '/');
                $link = $baseUrl . '/Reset_password.html?token=' . rawurlencode($token);
                $sent = Mailer::send(
                    $email,
                    'Restablecer contraseña',
                    "Usa este enlace dentro de 30 minutos para restablecer tu contraseña:\r\n$link"
                );
                if (!$sent) {
                    $users->deleteResetToken($tokenHash);
                }
            }
        }

        $this->respond(200, ['message' => 'if_account_exists']);
    }

    private function completeReset(User $users, array $input): never
    {
        $token = (string) ($input['token'] ?? '');
        $password = (string) ($input['password'] ?? '');
        $confirmation = (string) ($input['password_confirm'] ?? '');

        if (!preg_match('/^[a-f0-9]{64}$/', $token)
            || strlen($password) < 8 || strlen($password) > 72 || $password !== $confirmation) {
            $this->respond(422, ['error' => 'invalid_reset']);
        }

        if (!$users->resetPasswordWithToken(hash('sha256', $token), password_hash($password, PASSWORD_DEFAULT))) {
            $this->respond(422, ['error' => 'invalid_reset']);
        }

        $this->respond(200, ['message' => 'password_updated']);
    }

    private function respond(int $status, array $payload): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
}