<?php
$host = 'localhost';
$dbname = 'revswift';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$conn->set_charset('utf8mb4');
?>
