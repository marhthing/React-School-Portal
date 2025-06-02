<?php
// get_classes.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require '../db.php';

$sql = "SELECT id, name FROM classes ORDER BY name";
$result = $conn->query($sql);

$classes = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $classes[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
}

echo json_encode($classes);
$conn->close();
?>