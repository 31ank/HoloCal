<?php
    $host = "";
    $user = "";
    $password = "";
    $database_name = "";
    $pdo = new PDO("mysql:host=$host;dbname=$database_name", $user, $password, array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ));
?>