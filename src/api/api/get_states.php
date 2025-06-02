<?php
require_once '../db.php';

$query = "SELECT name FROM states ORDER BY name";
$result = $conn->query($query);

$states = [];
while ($row = $result->fetch_assoc()) {
  $states[] = $row['name'];
}

echo json_encode($states);