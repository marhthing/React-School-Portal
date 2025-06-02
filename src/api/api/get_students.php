<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
require '../db.php';

// Get class, term, and session from query params
$classId = isset($_GET['classId']) ? intval($_GET['classId']) : 0;
$termId = isset($_GET['termId']) ? intval($_GET['termId']) : 0;
$sessionId = isset($_GET['sessionId']) ? intval($_GET['sessionId']) : 0;

if (!$classId || !$termId || !$sessionId) {
    echo json_encode(['error' => 'Missing classId, termId, or sessionId']);
    exit;
}

$sql = "
    SELECT 
        s.regNumber AS reg_no,
        CONCAT_WS(' ', s.first_name, s.other_name, s.last_name) AS name,
        s.gender,
        CASE 
            WHEN sr.id IS NOT NULL THEN 1
            ELSE 0
        END AS registered
    FROM students s
    LEFT JOIN (
        SELECT DISTINCT student_reg_number, MIN(id) AS id
        FROM subject_registrations
        WHERE class_id = ? AND term_id = ? AND session_id = ?
        GROUP BY student_reg_number
    ) sr ON s.regNumber = sr.student_reg_number
    WHERE s.class_id = ?
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("iiii", $classId, $termId, $sessionId, $classId);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $row['registered'] = (bool) $row['registered']; // Convert 1/0 to true/false
    $students[] = $row;
}

echo json_encode($students);
$stmt->close();
$conn->close();