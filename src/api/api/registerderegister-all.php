<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request for CORS
    exit(0);
}

require '../db.php';

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['classId'], $input['termId'], $input['sessionId'], $input['action']) ||
    !in_array($input['action'], ['register', 'deregister'])
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid parameters']);
    exit;
}

$classId = intval($input['classId']);
$termId = intval($input['termId']);
$sessionId = intval($input['sessionId']);
$action = $input['action'];

try {
    // Start transaction
    $conn->begin_transaction();

    if ($action === 'deregister') {
        // Delete all registrations for the class, term, session
        $delSql = "DELETE FROM subject_registrations WHERE class_id = ? AND term_id = ? AND session_id = ?";
        $delStmt = $conn->prepare($delSql);
        if (!$delStmt) throw new Exception("Prepare failed: " . $conn->error);
        $delStmt->bind_param("iii", $classId, $termId, $sessionId);
        $delStmt->execute();
        $delStmt->close();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'All registrations deregistered successfully.']);
        exit;
    }

    if ($action === 'register') {
        // 1. Get all students in class
        $studentsSql = "SELECT regNumber FROM students WHERE class_id = ?";
        $stmtStudents = $conn->prepare($studentsSql);
        if (!$stmtStudents) throw new Exception("Prepare failed: " . $conn->error);
        $stmtStudents->bind_param("i", $classId);
        $stmtStudents->execute();
        $resultStudents = $stmtStudents->get_result();

        $students = [];
        while ($row = $resultStudents->fetch_assoc()) {
            $students[] = $row['regNumber'];
        }
        $stmtStudents->close();

        if (count($students) === 0) {
            throw new Exception("No students found in the selected class.");
        }

        // 2. Get all subjects assigned to this class (subject_classes table assumed)
        $subjectsSql = "SELECT subject_id FROM subject_classes WHERE class_id = ?";
        $stmtSubjects = $conn->prepare($subjectsSql);
        if (!$stmtSubjects) throw new Exception("Prepare failed: " . $conn->error);
        $stmtSubjects->bind_param("i", $classId);
        $stmtSubjects->execute();
        $resultSubjects = $stmtSubjects->get_result();

        $subjectIds = [];
        while ($row = $resultSubjects->fetch_assoc()) {
            $subjectIds[] = $row['subject_id'];
        }
        $stmtSubjects->close();

        if (count($subjectIds) === 0) {
            throw new Exception("No subjects assigned to the selected class.");
        }

        // 3. Prepare insert statement for bulk insert with UNIQUE constraint to avoid duplicates
        $insertSql = "INSERT IGNORE INTO subject_registrations (student_reg_number, subject_id, class_id, term_id, session_id) VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        if (!$insertStmt) throw new Exception("Prepare failed: " . $conn->error);

        // Insert for each student and subject combination
        foreach ($students as $regNumber) {
            foreach ($subjectIds as $subjectId) {
                $insertStmt->bind_param("siiii", $regNumber, $subjectId, $classId, $termId, $sessionId);
                $insertStmt->execute();
            }
        }
        $insertStmt->close();

        $conn->commit();

        echo json_encode(['success' => true, 'message' => 'All students registered for all subjects successfully.']);
        exit;
    }
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}

$conn->close();