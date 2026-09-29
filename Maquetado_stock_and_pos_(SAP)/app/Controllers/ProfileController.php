<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Session;
use App\Models\User;
use App\Services\PhotoStorage;
use InvalidArgumentException;
use mysqli_sql_exception;
use RuntimeException;
use Throwable;

final class ProfileController
{
    public function handle(): never
    {
        $userId = Session::userId();
        if ($userId === null) {
            $this->respond(401, ['error' => 'authentication_required']);
        }

        try {
            $users = new User(Database::connection());
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $this->respond(200, ['profile' => $users->profile($userId)]);
            }

            if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'], true)) {
                header('Allow: GET, POST, PUT');
                $this->respond(405, ['error' => 'method_not_allowed']);
            }

            $input = json_decode((string) file_get_contents('php://input'), true);
            $input = is_array($input) ? $input : $_POST;

            if (($input['action'] ?? '') === 'password') {
                $this->changePassword($users, $userId, $input);
            }

            $name = trim((string) ($input['name'] ?? ''));
            $email = strtolower(trim((string) ($input['email'] ?? '')));
            $description = trim((string) ($input['description'] ?? ''));
            if ($name === '' || mb_strlen($name) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)
                || mb_strlen($email) > 500 || mb_strlen($description) > 5000) {
                $this->respond(422, ['error' => 'invalid_profile']);
            }
            if ($users->emailExists($email, $userId)) {
                $this->respond(409, ['error' => 'duplicate_email']);
            }

            $currentProfile = $users->profile($userId);
            $photo = PhotoStorage::store($_FILES['photo'] ?? null);
            try {
                $users->updateProfile($userId, $name, $email, $description, $photo);
            } catch (Throwable $exception) {
                PhotoStorage::delete($photo);
                throw $exception;
            }
            if ($photo !== null) {
                PhotoStorage::delete($currentProfile['photo'] ?? null);
            }
            Session::setUserName($name);
            $this->respond(200, ['profile' => $users->profile($userId)]);
        } catch (mysqli_sql_exception $exception) {
            error_log($exception->getMessage());
            $this->respond(500, ['error' => 'database_error']);
        } catch (InvalidArgumentException $exception) {
            $this->respond(422, ['error' => $exception->getMessage()]);
        } catch (RuntimeException $exception) {
            error_log($exception->getMessage());
            $this->respond(500, ['error' => 'photo_storage_error']);
        }
    }

    private function changePassword(User $users, int $userId, array $input): never
    {
        $current = (string) ($input['current_password'] ?? '');
        $new = (string) ($input['new_password'] ?? '');
        $confirm = (string) ($input['confirm_password'] ?? '');
        $hash = $users->passwordHash($userId);

        if (!$hash || !password_verify($current, $hash)) {
            $this->respond(422, ['error' => 'invalid_current_password']);
        }
        if (strlen($new) < 8 || strlen($new) > 72 || $new !== $confirm) {
            $this->respond(422, ['error' => 'invalid_new_password']);
        }

        $users->updatePassword($userId, password_hash($new, PASSWORD_DEFAULT));
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