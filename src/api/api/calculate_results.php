<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = getInput();
$class = $data['class'] ?? null;
$term = $data['term'] ?? null;
$session_id = $data['session_id'] ?? null;

if (!$class || !$term || !$session_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: class, term, session_id']);
    exit;
}

// Fetch students in the class
$stmtStudents = $conn->prepare("SELECT regNumber FROM students WHERE className = ?");
$stmtStudents->bind_param("s", $class);
$stmtStudents->execute();
$resultStudents = $stmtStudents->get_result();

if (!$resultStudents) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch students']);
    exit;
}

$students = [];
while ($row = $resultStudents->fetch_assoc()) {
    $students[] = $row['regNumber'];
}

$stmtStudents->close();

function getGrade($score) {
    if ($score >= 70) return 'A';
    if ($score >= 60) return 'B';
    if ($score >= 50) return 'C';
    if ($score >= 45) return 'D';
    if ($score >= 40) return 'E';
    return 'F';
}

foreach ($students as $reg) {
    $stmtScores = $conn->prepare("SELECT subject_id, ca1, ca2, exam FROM scores WHERE student_regNumber = ? AND term = ? AND session_id = ?");
    $stmtScores->bind_param("ssi", $reg, $term, $session_id);
    $stmtScores->execute();
    $resultScores = $stmtScores->get_result();

    if (!$resultScores) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch scores for student '.$reg]);
        exit;
    }

    while ($scoreRow = $resultScores->fetch_assoc()) {
        $total = (int)$scoreRow['ca1'] + (int)$scoreRow['ca2'] + (int)$scoreRow['exam'];
        $grade = getGrade($total);

        // Insert or update result (REPLACE equivalent)
        $stmtUpsert = $conn->prepare(
            "INSERT INTO results (student_regNumber, subject_id, term, session_id, total_score, grade) VALUES (?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE total_score=VALUES(total_score), grade=VALUES(grade), calculated_at=NOW()"
        );
        $stmtUpsert->bind_param("sisiss", $reg, $scoreRow['subject_id'], $term, $session_id, $total, $grade);
        $stmtUpsert->execute();
        $stmtUpsert->close();
    }
    $stmtScores->close();
}

echo json_encode(['message' => 'Results calculated successfully']);

$conn->close();