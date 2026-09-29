<?php
declare(strict_types=1);

namespace App\Core;

final class Session
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        session_set_cookie_params([
            'httponly' => true,
            'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function authenticate(int $userId, string $userName): void
    {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $userName;
    }

    public static function isAuthenticated(): bool
    {
        return isset($_SESSION['user_id']) && (int) $_SESSION['user_id'] > 0;
    }

    public static function userId(): ?int
    {
        return self::isAuthenticated() ? (int) $_SESSION['user_id'] : null;
    }

    public static function setUserName(string $userName): void
    {
        $_SESSION['user_name'] = $userName;
    }

    public static function destroy(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $parameters = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $parameters['path'],
                'domain' => $parameters['domain'],
                'secure' => $parameters['secure'],
                'httponly' => $parameters['httponly'],
                'samesite' => $parameters['samesite'] ?? 'Lax',
            ]);
        }

        session_destroy();
    }
}