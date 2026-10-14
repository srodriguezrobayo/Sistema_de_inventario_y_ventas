
<?php

session_start();

$_SESSION = [];
session_destroy();

header('Location: ../../Front_end/login.html');
exit;
