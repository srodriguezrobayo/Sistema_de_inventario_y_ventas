
<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
    echo "<script>console.log('Sesión iniciada');</script>";
}

if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true
) {
    header('Location: login.html');
    echo "<script>console.log('Sesión no válida');</script>";
    exit;
}
