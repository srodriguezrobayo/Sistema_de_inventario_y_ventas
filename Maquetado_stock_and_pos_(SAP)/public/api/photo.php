<?php
declare(strict_types=1);

use App\Config\Database;
use App\Core\Session;
use App\Models\Product;
use App\Models\User;
use App\Services\PhotoStorage;

require_once __DIR__ . '/../../app/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    exit;
}

$userId = Session::userId();
if ($userId === null) {
    http_response_code(401);
    exit;
}

$database = Database::connection();
$type = (string) ($_GET['type'] ?? '');
$filename = null;

if ($type === 'profile') {
    $filename = (new User($database))->profile($userId)['photo'] ?? null;
} elseif ($type === 'product') {
    $productId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if ($productId) {
        $filename = (new Product($database))->findForUser($productId, $userId)['photo'] ?? null;
    }
}

$path = PhotoStorage::path($filename);
if ($path === null) {
    http_response_code(404);
    exit;
}

$fileInfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $fileInfo->file($path);
if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'], true)) {
    http_response_code(404);
    exit;
}

header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, max-age=300');
header('X-Content-Type-Options: nosniff');
readfile($path);