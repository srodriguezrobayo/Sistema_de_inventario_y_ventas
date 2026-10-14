
<?php

$con = mysqli_connect(
    '127.0.0.1',
    'root',
    '',
    'sap',
    3307
);

if (!$con) {
    error_log("Error de conexión: " . mysqli_connect_error());
    die("No fue posible conectar con la base de datos.");
}

mysqli_set_charset($con, "utf8mb4");
?>
