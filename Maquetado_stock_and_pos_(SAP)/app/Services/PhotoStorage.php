<?php
declare(strict_types=1);

namespace App\Services;

use InvalidArgumentException;
use RuntimeException;

final class PhotoStorage
{
    private const MAX_BYTES = 5_242_880;
    private const MIME_EXTENSIONS = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    public static function store(?array $upload): ?string
    {
        if ($upload === null || ($upload['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        if (($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($upload['tmp_name'] ?? '')) {
            throw new InvalidArgumentException('invalid_upload');
        }
        if (($upload['size'] ?? 0) < 1 || $upload['size'] > self::MAX_BYTES) {
            throw new InvalidArgumentException('invalid_size');
        }

        $fileInfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $fileInfo->file($upload['tmp_name']);
        $extension = self::MIME_EXTENSIONS[$mimeType] ?? null;
        $dimensions = @getimagesize($upload['tmp_name']);
        if ($extension === null || $dimensions === false || $dimensions[0] > 8000 || $dimensions[1] > 8000) {
            throw new InvalidArgumentException('invalid_image');
        }

        $directory = self::directory();
        if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
            throw new RuntimeException('photo_storage_unavailable');
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $extension;
        if (!move_uploaded_file($upload['tmp_name'], $directory . DIRECTORY_SEPARATOR . $filename)) {
            throw new RuntimeException('photo_storage_unavailable');
        }

        return $filename;
    }

    public static function path(?string $filename): ?string
    {
        if (!$filename || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', $filename)) {
            return null;
        }

        $path = self::directory() . DIRECTORY_SEPARATOR . $filename;

        return is_file($path) ? $path : null;
    }

    public static function delete(?string $filename): void
    {
        $path = self::path($filename);
        if ($path !== null) {
            unlink($path);
        }
    }

    private static function directory(): string
    {
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads';
    }
}