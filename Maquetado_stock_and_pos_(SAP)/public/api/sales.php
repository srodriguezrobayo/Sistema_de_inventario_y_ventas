<?php
declare(strict_types=1);

require_once __DIR__ . '/../../app/bootstrap.php';
require_once dirname(__DIR__, 2) . '/app/Models/Sale.php';
require_once dirname(__DIR__, 2) . '/app/Controllers/SaleController.php';

(new \App\Controllers\SaleController())->handle();