<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
require '../db.php';

// Get parameters from query
$regNo = $_GET['reg_no'] ?? '';
$classId = isset($_GET['classId']) ? intval($_GET['classId']) : 0;
$termId = isset($_GET['termId']) ? intval($_GET['termId']) : 0;
$sessionId = isset($_GET['sessionId']) ? intval($_GET['sessionId']) : 0;

if (!$regNo || !$classId || !$termId || !$sessionId) {
    echo json_encode(['error' => 'Missing reg_no, classId, termId, or sessionId']);
    exit;
}

// Get all class subjects and whether the student is actively registered for each
$sql = "
    SELECT 
        sub.id AS subject_id,
        sub.name AS subject_name,
        CASE 
            WHEN sr.id IS NOT NULL AND sr.active = 1 THEN 1
            ELSE 0
        END AS registered
    FROM subjects sub
    INNER JOIN subject_classes sc ON sub.id = sc.subject_id
    LEFT JOIN subject_registrations sr 
        ON sr.student_reg_number = ?
        AND sr.subject_id = sub.id
        AND sr.class_id = ?
        AND sr.term_id = ?
        AND sr.session_id = ?
    WHERE sc.class_id = ?
    ORDER BY sub.name ASC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'SQL prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("siiii", $regNo, $classId, $termId, $sessionId, $classId);
$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
while ($row = $result->fetch_assoc()) {
    $row['registered'] = (bool) $row['registered'];
    $subjects[] = $row;
}

echo json_encode($subjects);

$stmt->close();
$conn->close();