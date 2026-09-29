<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';
require_once __DIR__ . '/Config/Environment.php';

\App\Config\Environment::load(dirname(__DIR__));

require_once __DIR__ . '/Config/Database.php';
require_once __DIR__ . '/Services/Mailer.php';
require_once __DIR__ . '/Services/PhotoStorage.php';
require_once __DIR__ . '/Core/Session.php';
require_once __DIR__ . '/Models/User.php';
require_once __DIR__ . '/Models/Product.php';
require_once __DIR__ . '/Models/Sale.php';
require_once __DIR__ . '/Models/Dashboard.php';
require_once __DIR__ . '/Controllers/AuthController.php';
require_once __DIR__ . '/Controllers/ProductController.php';
require_once __DIR__ . '/Controllers/SaleController.php';
require_once __DIR__ . '/Controllers/ProfileController.php';
require_once __DIR__ . '/Controllers/DashboardController.php';
require_once __DIR__ . '/Controllers/PasswordResetController.php';

\App\Core\Session::start();