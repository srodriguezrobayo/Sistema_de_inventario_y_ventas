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
                $sent = Mailer::send(
                    $email,
                    'Factura #' . $sale['id'],
                    $this->invoiceBody($sale),
                    $this->invoiceHtmlBody($sale)
                );
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

    private function invoiceHtmlBody(array $sale): string
    {
        $escape = static fn (mixed $value): string => htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $currency = static fn (mixed $value): string => '$' . number_format((float) $value, 2, ',', '.') . ' COP';
        $rows = '';

        foreach ($sale['items'] as $item) {
            $rows .= '<tr>'
                . '<td style="padding:14px 12px;border-bottom:1px solid #e8ecef;color:#263238;">' . $escape($item['name']) . '</td>'
                . '<td align="center" style="padding:14px 8px;border-bottom:1px solid #e8ecef;color:#536168;">' . $escape($item['quantity']) . '</td>'
                . '<td align="right" style="padding:14px 12px;border-bottom:1px solid #e8ecef;color:#536168;white-space:nowrap;">' . $currency($item['unit_price']) . '</td>'
                . '<td align="right" style="padding:14px 12px;border-bottom:1px solid #e8ecef;color:#263238;font-weight:600;white-space:nowrap;">' . $currency($item['subtotal']) . '</td>'
                . '</tr>';
        }

        $invoiceId = $escape($sale['id']);
        $invoiceDate = $escape(date('d/m/Y H:i', strtotime((string) $sale['sold_at'])));
        $total = $currency($sale['total']);

        return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>'
            . '<body style="margin:0;padding:0;background-color:#f2f5f4;font-family:Arial,Helvetica,sans-serif;color:#263238;">'
            . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Factura de compra #' . $invoiceId . '</div>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f2f5f4;padding:28px 12px;">'
            . '<tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e3e9e6;border-radius:10px;overflow:hidden;">'
            . '<tr><td style="padding:24px 30px;background-color:#176b55;color:#ffffff;">'
            . '<div style="font-size:13px;font-weight:700;letter-spacing:1px;">SAP <span style="font-weight:400;color:#d5eee5;">STOCK &amp; POS</span></div>'
            . '<h1 style="margin:20px 0 4px;font-size:26px;line-height:1.25;font-weight:700;color:#ffffff;">Factura de venta</h1>'
            . '<p style="margin:0;font-size:14px;color:#e3f2ec;">Gracias por tu compra. Aquí tienes el detalle.</p>'
            . '</td></tr>'
            . '<tr><td style="padding:24px 30px 8px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>'
            . '<td style="font-size:12px;color:#718078;text-transform:uppercase;">Número de factura</td><td align="right" style="font-size:12px;color:#718078;text-transform:uppercase;">Fecha de emisión</td>'
            . '</tr><tr><td style="padding-top:5px;font-size:18px;font-weight:700;color:#176b55;">#' . $invoiceId . '</td><td align="right" style="padding-top:5px;font-size:14px;color:#263238;">' . $invoiceDate . '</td></tr></table></td></tr>'
            . '<tr><td style="padding:16px 30px 8px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">'
            . '<tr style="background-color:#f5f8f6;"><th align="left" style="padding:11px 12px;font-size:11px;color:#61716a;text-transform:uppercase;">Producto</th><th align="center" style="padding:11px 8px;font-size:11px;color:#61716a;text-transform:uppercase;">Cant.</th><th align="right" style="padding:11px 12px;font-size:11px;color:#61716a;text-transform:uppercase;">Precio</th><th align="right" style="padding:11px 12px;font-size:11px;color:#61716a;text-transform:uppercase;">Subtotal</th></tr>'
            . $rows
            . '</table></td></tr>'
            . '<tr><td style="padding:12px 30px 26px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#edf6f1;border-radius:8px;"><tr><td style="padding:17px 18px;font-size:15px;font-weight:600;color:#29483d;">Total pagado</td><td align="right" style="padding:17px 18px;font-size:22px;font-weight:700;color:#176b55;white-space:nowrap;">' . $total . '</td></tr></table></td></tr>'
            . '<tr><td style="padding:17px 30px;background-color:#f8faf9;border-top:1px solid #e8ecef;font-size:12px;line-height:1.6;color:#718078;">Este mensaje confirma el detalle de tu compra. Conserva esta factura para tus registros.</td></tr>'
            . '</table></td></tr></table></body></html>';
    }

    private function respond(int $status, array $payload): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
}