<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Session;
use App\Models\Dashboard;
use mysqli_sql_exception;

final class DashboardController
{
    public function handle(): never
    {
        $userId = Session::userId();
        if ($userId === null) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'authentication_required']);
            exit;
        }

        try {
            $summary = (new Dashboard(Database::connection()))->summary($userId);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            exit;
        } catch (mysqli_sql_exception $exception) {
            error_log($exception->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'database_error']);
            exit;
        }
    }
}