<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

final class User
{
    public function __construct(private readonly mysqli $database)
    {
    }

    public function findActiveByEmail(string $email): ?array
    {
        $statement = $this->database->prepare(
            'SELECT Id_usuario, Nombre_usuario, Contrasena_usuario FROM Usuarios WHERE Email_usuario = ? AND Estado_usuario = 1 LIMIT 1'
        );
        $statement->bind_param('s', $email);
        $statement->execute();
        $user = $statement->get_result()->fetch_assoc();

        return $user ?: null;
    }

    public function existsByEmail(string $email): bool
    {
        $statement = $this->database->prepare('SELECT Id_usuario FROM Usuarios WHERE Email_usuario = ? LIMIT 1');
        $statement->bind_param('s', $email);
        $statement->execute();

        return $statement->get_result()->fetch_assoc() !== null;
    }

    public function create(string $name, string $email, string $passwordHash): int
    {
        $statement = $this->database->prepare(
            'INSERT INTO Usuarios (Nombre_usuario, Email_usuario, Contrasena_usuario, Estado_usuario) VALUES (?, ?, ?, 1)'
        );
        $statement->bind_param('sss', $name, $email, $passwordHash);
        $statement->execute();

        return (int) $this->database->insert_id;
    }

    public function profile(int $userId): ?array
    {
        $statement = $this->database->prepare(
            'SELECT Id_usuario AS id, Nombre_usuario AS name, Email_usuario AS email, '
            . 'Descripcion_usuario AS description, Foto_usuario AS photo '
            . 'FROM Usuarios WHERE Id_usuario = ? AND Estado_usuario = 1 LIMIT 1'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $profile = $statement->get_result()->fetch_assoc();

        return $profile ?: null;
    }

    public function emailExists(string $email, int $exceptUserId): bool
    {
        $statement = $this->database->prepare(
            'SELECT Id_usuario FROM Usuarios WHERE Email_usuario = ? AND Id_usuario <> ? LIMIT 1'
        );
        $statement->bind_param('si', $email, $exceptUserId);
        $statement->execute();

        return $statement->get_result()->fetch_assoc() !== null;
    }

    public function updateProfile(int $userId, string $name, string $email, string $description, ?string $photo): void
    {
        $statement = $this->database->prepare(
            'UPDATE Usuarios SET Nombre_usuario = ?, Email_usuario = ?, Descripcion_usuario = ?, '
            . 'Foto_usuario = COALESCE(?, Foto_usuario) '
            . 'WHERE Id_usuario = ? AND Estado_usuario = 1'
        );
        $statement->bind_param('ssssi', $name, $email, $description, $photo, $userId);
        $statement->execute();
    }

    public function passwordHash(int $userId): ?string
    {
        $statement = $this->database->prepare(
            'SELECT Contrasena_usuario FROM Usuarios WHERE Id_usuario = ? AND Estado_usuario = 1 LIMIT 1'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $row = $statement->get_result()->fetch_assoc();

        return $row['Contrasena_usuario'] ?? null;
    }

    public function updatePassword(int $userId, string $passwordHash): void
    {
        $statement = $this->database->prepare(
            'UPDATE Usuarios SET Contrasena_usuario = ? WHERE Id_usuario = ? AND Estado_usuario = 1'
        );
        $statement->bind_param('si', $passwordHash, $userId);
        $statement->execute();
    }

    public function activeIdByEmail(string $email): ?int
    {
        $statement = $this->database->prepare(
            'SELECT Id_usuario FROM Usuarios WHERE Email_usuario = ? AND Estado_usuario = 1 LIMIT 1'
        );
        $statement->bind_param('s', $email);
        $statement->execute();
        $row = $statement->get_result()->fetch_assoc();

        return $row ? (int) $row['Id_usuario'] : null;
    }

    public function hasRecentResetRequest(int $userId): bool
    {
        $statement = $this->database->prepare(
            'SELECT Id_token FROM Password_reset_tokens WHERE Usuario_id_usuario = ? '
            . 'AND Creacion_token > DATE_SUB(NOW(), INTERVAL 2 MINUTE) LIMIT 1'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();

        return $statement->get_result()->fetch_assoc() !== null;
    }

    public function createResetToken(int $userId, string $tokenHash, string $expiresAt): void
    {
        $statement = $this->database->prepare(
            'INSERT INTO Password_reset_tokens (Usuario_id_usuario, Token_hash, Fecha_expiracion) VALUES (?, ?, ?)'
        );
        $statement->bind_param('iss', $userId, $tokenHash, $expiresAt);
        $statement->execute();
    }

    public function deleteResetToken(string $tokenHash): void
    {
        $statement = $this->database->prepare('DELETE FROM Password_reset_tokens WHERE Token_hash = ? AND Fecha_uso IS NULL');
        $statement->bind_param('s', $tokenHash);
        $statement->execute();
    }

    public function resetPasswordWithToken(string $tokenHash, string $passwordHash): bool
    {
        $this->database->begin_transaction();
        try {
            $find = $this->database->prepare(
                'SELECT Id_token, Usuario_id_usuario FROM Password_reset_tokens '
                . 'WHERE Token_hash = ? AND Fecha_uso IS NULL AND Fecha_expiracion > NOW() LIMIT 1 FOR UPDATE'
            );
            $find->bind_param('s', $tokenHash);
            $find->execute();
            $token = $find->get_result()->fetch_assoc();
            if (!$token) {
                $this->database->rollback();
                return false;
            }

            $this->updatePassword((int) $token['Usuario_id_usuario'], $passwordHash);
            $consume = $this->database->prepare('UPDATE Password_reset_tokens SET Fecha_uso = NOW() WHERE Id_token = ?');
            $consume->bind_param('i', $token['Id_token']);
            $consume->execute();
            $this->database->commit();

            return true;
        } catch (\Throwable $exception) {
            $this->database->rollback();
            throw $exception;
        }
    }
}