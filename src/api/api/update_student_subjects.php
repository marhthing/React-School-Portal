<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
require '../db.php';

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$regNo = $input['reg_no'] ?? '';
$classId = isset($input['classId']) ? intval($input['classId']) : 0;
$termId = isset($input['termId']) ? intval($input['termId']) : 0;
$sessionId = isset($input['sessionId']) ? intval($input['sessionId']) : 0;
$subjects = $input['subjects'] ?? [];

if (!$regNo || !$classId || !$termId || !$sessionId || !is_array($subjects)) {
    echo json_encode(['success' => false, 'error' => 'Missing or invalid parameters']);
    exit;
}

$conn->begin_transaction();

try {
    // Prepare statements once for update and insert
    $sqlCheck = "SELECT id FROM subject_registrations WHERE student_reg_number = ? AND subject_id = ? AND class_id = ? AND term_id = ? AND session_id = ?";
    $stmtCheck = $conn->prepare($sqlCheck);
    if (!$stmtCheck) throw new Exception("Prepare failed (check): " . $conn->error);

    $sqlUpdate = "UPDATE subject_registrations SET active = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    if (!$stmtUpdate) throw new Exception("Prepare failed (update): " . $conn->error);

    $sqlInsert = "INSERT INTO subject_registrations (student_reg_number, subject_id, class_id, term_id, session_id, active) VALUES (?, ?, ?, ?, ?, ?)";
    $stmtInsert = $conn->prepare($sqlInsert);
    if (!$stmtInsert) throw new Exception("Prepare failed (insert): " . $conn->error);

    foreach ($subjects as $subject) {
        $subjectId = intval($subject['subject_id']);
        $active = $subject['registered'] ? 1 : 0;

        // Check if registration exists
        $stmtCheck->bind_param("siiii", $regNo, $subjectId, $classId, $termId, $sessionId);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            // Exists — bind result and fetch
            $stmtCheck->bind_result($regId);
            $stmtCheck->fetch();

            $stmtUpdate->bind_param("ii", $active, $regId);
            $stmtUpdate->execute();
        } else {
            // Doesn't exist — insert new row
            $stmtInsert->bind_param("siiiii", $regNo, $subjectId, $classId, $termId, $sessionId, $active);
            $stmtInsert->execute();
        }
    }

    $stmtCheck->close();
    $stmtUpdate->close();
    $stmtInsert->close();

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>