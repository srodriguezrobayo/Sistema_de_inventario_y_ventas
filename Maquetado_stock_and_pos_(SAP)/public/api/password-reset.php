<?php
declare(strict_types=1);

require_once __DIR__ . '/../../app/bootstrap.php';
require_once dirname(__DIR__, 2) . '/app/Controllers/PasswordResetController.php';

(new \App\Controllers\PasswordResetController())->handle();