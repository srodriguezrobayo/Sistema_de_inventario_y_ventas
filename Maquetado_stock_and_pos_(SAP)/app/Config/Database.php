<?php
declare(strict_types=1);

namespace App\Config;

use mysqli;

final class Database
{
    private static ?mysqli $connection = null;

    public static function connection(): mysqli
    {
        if (self::$connection instanceof mysqli) {
            return self::$connection;
        }

        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        self::$connection = new mysqli(
            getenv('SAP_DB_HOST') ?: '127.0.0.1',
            getenv('SAP_DB_USER') ?: 'root',
            getenv('SAP_DB_PASSWORD') ?: '',
            getenv('SAP_DB_NAME') ?: 'SAP'
        );
        self::$connection->set_charset('utf8mb4');

        return self::$connection;
    }
}