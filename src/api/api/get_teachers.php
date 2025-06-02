<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require '../db.php';

// Use correct column name: 'name'
$sql = "SELECT id, name FROM teachers ORDER BY name";
$result = $conn->query($sql);

$teachers = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $teachers[] = [
            'id' => (int) $row['id'],
            'name' => $row['name']
        ];
    }
}

echo json_encode($teachers);
$conn->close();