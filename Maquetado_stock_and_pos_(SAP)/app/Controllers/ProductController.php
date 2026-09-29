<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Session;
use App\Models\Product;
use App\Services\PhotoStorage;
use mysqli_sql_exception;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

final class ProductController
{
    public function handle(): never
    {
        $userId = Session::userId();
        if ($userId === null) {
            $this->respond(401, ['error' => 'authentication_required']);
        }

        try {
            $products = new Product(Database::connection());
            $method = $_SERVER['REQUEST_METHOD'];
            $productId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT) ?: null;

            if ($method === 'GET') {
                if ($productId !== null) {
                    $product = $products->findForUser($productId, $userId);
                    $this->respond($product ? 200 : 404, $product ? ['product' => $product] : ['error' => 'not_found']);
                }

                $this->respond(200, ['products' => $products->listForUser($userId)]);
            }

            $input = $this->input();
            if ($method === 'POST' && ($input['action'] ?? '') === 'receive') {
                $receipt = $this->receipt($input);
                if (!$receipt || !$productId || !$products->receive($productId, $receipt, $userId)) {
                    $this->respond(422, ['error' => 'invalid_receipt_or_product']);
                }
                $this->respond(200, ['message' => 'stock_received']);
            }

            if ($method === 'POST') {
                $product = $this->productInput($input);
                if (!$product) {
                    $this->respond(422, ['error' => 'invalid_product']);
                }
                if ($products->codeExists($product['code'], $userId)) {
                    $this->respond(409, ['error' => 'duplicate_code']);
                }
                $photo = PhotoStorage::store($_FILES['photo'] ?? null);
                try {
                    $id = $products->create($product, $userId, $photo);
                } catch (Throwable $exception) {
                    PhotoStorage::delete($photo);
                    throw $exception;
                }
                $this->respond(201, ['id' => $id]);
            }

            if ($method === 'PUT' && $productId) {
                $product = $this->productInput($input, false);
                if (!$product) {
                    $this->respond(422, ['error' => 'invalid_product']);
                }
                if ($products->codeExists($product['code'], $userId, $productId)) {
                    $this->respond(409, ['error' => 'duplicate_code']);
                }
                $existing = $products->findForUser($productId, $userId);
                if (!$existing) {
                    $this->respond(404, ['error' => 'not_found']);
                }
                $photo = PhotoStorage::store($_FILES['photo'] ?? null);
                try {
                    $updated = $products->update($productId, $product, $userId, $photo);
                } catch (Throwable $exception) {
                    PhotoStorage::delete($photo);
                    throw $exception;
                }
                if (!$updated) {
                    PhotoStorage::delete($photo);
                    $this->respond(404, ['error' => 'not_found']);
                }
                if ($photo !== null) {
                    PhotoStorage::delete($existing['photo']);
                }
                $this->respond(200, ['message' => 'product_updated']);
            }

            if ($method === 'DELETE' && $productId) {
                $this->respond(
                    $products->deactivate($productId, $userId) ? 200 : 404,
                    ['message' => 'product_deactivated']
                );
            }

            header('Allow: GET, POST, PUT, DELETE');
            $this->respond(405, ['error' => 'method_not_allowed']);
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

    private function productInput(array $input, bool $includeQuantity = true): ?array
    {
        $name = trim((string) ($input['name'] ?? ''));
        $code = trim((string) ($input['code'] ?? ''));
        $price = $input['price'] ?? null;
        $unit = trim((string) ($input['unit'] ?? ''));
        $hasExpiry = filter_var($input['has_expiry'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $knowsExpiry = filter_var($input['knows_expiry'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $expiresOn = trim((string) ($input['expires_on'] ?? '')) ?: null;
        $minimumStock = filter_var($input['minimum_stock'] ?? null, FILTER_VALIDATE_INT);
        $quantity = $includeQuantity ? filter_var($input['quantity'] ?? null, FILTER_VALIDATE_INT) : 0;

        if ($name === '' || mb_strlen($name) > 100 || $code === '' || mb_strlen($code) > 100
            || !is_numeric($price) || (float) $price < 0 || (float) $price > 9999999999.99
            || $unit === '' || mb_strlen($unit) > 100 || $minimumStock === false || $minimumStock < 0
            || $quantity === false || $quantity < 0) {
            return null;
        }

        if ($hasExpiry && $knowsExpiry && !$this->validDate($expiresOn)) {
            return null;
        }

        return [
            'name' => $name,
            'code' => $code,
            'price' => (float) $price,
            'quantity' => $quantity,
            'unit' => $unit,
            'has_expiry' => $hasExpiry ? 1 : 0,
            'knows_expiry' => $hasExpiry ? ($knowsExpiry ? 1 : 0) : null,
            'expires_on' => $hasExpiry && $knowsExpiry ? $expiresOn : null,
            'minimum_stock' => $minimumStock,
        ];
    }

    private function receipt(array $input): ?array
    {
        $quantity = filter_var($input['quantity'] ?? null, FILTER_VALIDATE_INT);
        $arrivedOn = (string) ($input['arrived_on'] ?? '');
        $expiresOn = trim((string) ($input['expires_on'] ?? '')) ?: null;
        $lot = trim((string) ($input['lot'] ?? '')) ?: null;

        if ($quantity === false || $quantity < 1 || !$this->validDate($arrivedOn)
            || ($expiresOn !== null && !$this->validDate($expiresOn))) {
            return null;
        }

        return ['quantity' => $quantity, 'arrived_on' => $arrivedOn, 'expires_on' => $expiresOn, 'lot' => $lot];
    }

    private function validDate(?string $date): bool
    {
        if (!$date) {
            return false;
        }
        $parsed = \DateTimeImmutable::createFromFormat('!Y-m-d', $date);

        return $parsed !== false && $parsed->format('Y-m-d') === $date;
    }

    private function input(): array
    {
        $json = json_decode((string) file_get_contents('php://input'), true);

        return is_array($json) ? $json : $_POST;
    }

    private function respond(int $status, array $payload): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
}