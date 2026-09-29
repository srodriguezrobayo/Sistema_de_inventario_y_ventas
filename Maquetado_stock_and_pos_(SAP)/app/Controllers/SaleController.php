<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Session;
use App\Models\Sale;
use App\Services\Mailer;
use mysqli_sql_exception;
use RuntimeException;

final class SaleController
{
    public function handle(): never
    {
        $userId = Session::userId();
        if ($userId === null) {
            $this->respond(401, ['error' => 'authentication_required']);
        }

        try {
            $sales = new Sale(Database::connection());
            $method = $_SERVER['REQUEST_METHOD'];
            $saleId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT) ?: null;

            if ($method === 'GET') {
                if ($saleId !== null) {
                    $sale = $sales->findForUser($saleId, $userId);
                    $this->respond($sale ? 200 : 404, $sale ? ['sale' => $sale] : ['error' => 'not_found']);
                }
                $this->respond(200, ['sales' => $sales->listForUser($userId)]);
            }

            $input = json_decode((string) file_get_contents('php://input'), true);
            $input = is_array($input) ? $input : $_POST;

            if ($method === 'POST' && ($input['action'] ?? '') === 'send-invoice') {
                $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
                if (!$saleId || !$email || !$sales->findForUser($saleId, $userId)) {
                    $this->respond(422, ['error' => 'invalid_invoice']);
                }

                $sale = $sales->findForUser($saleId, $userId);
                $sent = Mailer::send($email, 'Factura #' . $sale['id'], $this->invoiceBody($sale));
                if (!$sent || !$sales->markInvoiceSent($saleId, $userId, $email)) {
                    $this->respond(503, ['error' => 'email_unavailable']);
                }
                $this->respond(200, ['message' => 'invoice_sent']);
            }

            if ($method === 'POST') {
                $items = $this->items($input['items'] ?? null);
                if (!$items) {
                    $this->respond(422, ['error' => 'invalid_items']);
                }
                $id = $sales->create($userId, $items);
                $this->respond(201, ['id' => $id]);
            }

            header('Allow: GET, POST');
            $this->respond(405, ['error' => 'method_not_allowed']);
        } catch (RuntimeException $exception) {
            $this->respond(409, ['error' => $exception->getMessage()]);
        } catch (mysqli_sql_exception $exception) {
            error_log($exception->getMessage());
            $this->respond(500, ['error' => 'database_error']);
        }
    }

    private function items(mixed $rawItems): array
    {
        if (!is_array($rawItems) || $rawItems === []) {
            return [];
        }

        $items = [];
        foreach ($rawItems as $item) {
            if (!is_array($item)) {
                return [];
            }
            $id = filter_var($item['product_id'] ?? null, FILTER_VALIDATE_INT);
            $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
            if (!$id || $quantity === false || $quantity < 1) {
                return [];
            }
            $items[$id] = ($items[$id] ?? 0) + $quantity;
        }

        return $items;
    }

    private function invoiceBody(array $sale): string
    {
        $lines = ['Factura #' . $sale['id'], 'Fecha: ' . $sale['sold_at'], ''];
        foreach ($sale['items'] as $item) {
            $lines[] = $item['name'] . ' x ' . $item['quantity'] . ' = ' . $item['subtotal'];
        }
        $lines[] = '';
        $lines[] = 'Total: ' . $sale['total'];

        return implode("\r\n", $lines);
    }

    private function respond(int $status, array $payload): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
}