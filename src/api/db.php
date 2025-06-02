<?php
$host = 'localhost';    // your DB host
$user = 'root';    // your DB username
$pass = '';// your DB password
$dbname = 'rpm';    // your DB name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed']));
}

$conn->set_charset('utf8mb4');
?>