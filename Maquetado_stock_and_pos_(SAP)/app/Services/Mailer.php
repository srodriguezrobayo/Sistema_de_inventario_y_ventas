<?php
declare(strict_types=1);

namespace App\Services;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

final class Mailer
{
    public static function isConfigured(): bool
    {
        return self::configuration() !== null;
    }

    public static function send(string $recipient, string $subject, string $body): bool
    {
        $configuration = self::configuration();
        if ($configuration === null || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $mailer = new PHPMailer(true);
        try {
            $mailer->isSMTP();
            $mailer->Host = $configuration['host'];
            $mailer->Port = $configuration['port'];
            $mailer->SMTPAuth = true;
            $mailer->Username = $configuration['username'];
            $mailer->Password = $configuration['password'];
            $mailer->Timeout = 15;
            $mailer->SMTPDebug = 0;
            $mailer->CharSet = PHPMailer::CHARSET_UTF8;
            $mailer->SMTPSecure = $configuration['encryption'] === 'ssl'
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mailer->setFrom($configuration['from'], $configuration['from_name']);
            $mailer->addAddress($recipient);
            $mailer->Subject = $subject;
            $mailer->Body = $body;
            $mailer->isHTML(false);
            $mailer->send();

            return true;
        } catch (Exception $exception) {
            error_log('SMTP error: ' . $exception->getMessage());
            return false;
        }
    }

    private static function configuration(): ?array
    {
        $host = trim((string) getenv('SAP_SMTP_HOST'));
        $port = filter_var(getenv('SAP_SMTP_PORT'), FILTER_VALIDATE_INT);
        $username = trim((string) getenv('SAP_SMTP_USERNAME'));
        $password = (string) getenv('SAP_SMTP_PASSWORD');
        $from = trim((string) getenv('SAP_MAIL_FROM'));
        $encryption = strtolower(trim((string) (getenv('SAP_SMTP_ENCRYPTION') ?: 'tls')));

        if ($host === '' || !$port || $port < 1 || $port > 65535 || $username === '' || $password === ''
            || !filter_var($from, FILTER_VALIDATE_EMAIL) || !in_array($encryption, ['tls', 'ssl'], true)) {
            return null;
        }

        return [
            'host' => $host,
            'port' => $port,
            'username' => $username,
            'password' => $password,
            'from' => $from,
            'from_name' => trim((string) (getenv('SAP_MAIL_FROM_NAME') ?: 'Sistema SAP')),
            'encryption' => $encryption,
        ];
    }
}