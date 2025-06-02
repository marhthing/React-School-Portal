<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
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

switch ($method) {
    case 'GET':
        $classId = isset($_GET['classId']) ? (int)$_GET['classId'] : null;
        $subjectId = isset($_GET['subjectId']) ? (int)$_GET['subjectId'] : null;
        $termName = isset($_GET['term']) ? trim($_GET['term']) : null;
        $sessionId = isset($_GET['sessionId']) ? (int)$_GET['sessionId'] : null;

        if (!$classId || !$termName || !$sessionId) {
            http_response_code(400);
            echo json_encode(['error' => 'classId, term, and sessionId are required']);
            exit;
        }

        // Lookup term ID
        $stmtTerm = $conn->prepare("SELECT id FROM terms WHERE name = ? AND active = 1 LIMIT 1");
        $stmtTerm->bind_param("s", $termName);
        $stmtTerm->execute();
        $resTerm = $stmtTerm->get_result();

        if ($resTerm->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or inactive term name']);
            exit;
        }
        $termRow = $resTerm->fetch_assoc();
        $termId = (int)$termRow['id'];

        $query = "
            SELECT
                sr.student_reg_number,
                CONCAT_WS(' ', st.first_name, st.other_name, st.last_name) AS student_name,
                sr.subject_id,
                subj.name AS subject_name,
                s.ca1,
                s.ca2,
                s.exam,
                s.total,
                s.uploaded_by_teacher_id,
                COALESCE(t.name, 'Admin') AS uploaded_by,
                s.updated_at AS uploaded_at
            FROM subject_registrations sr
            JOIN students st ON st.regNumber = sr.student_reg_number
            JOIN subjects subj ON sr.subject_id = subj.id
            LEFT JOIN scores s ON s.student_regNumber = sr.student_reg_number
                AND s.subject_id = sr.subject_id
                AND s.term_id = ?
                AND s.session_id = ?
            LEFT JOIN teachers t ON s.uploaded_by_teacher_id = t.id
            WHERE sr.active = 1
                AND sr.term_id = ?
                AND sr.session_id = ?
                AND sr.class_id = ?
        ";

        if ($subjectId) {
            $query .= " AND sr.subject_id = ?";
        }

        $query .= " ORDER BY sr.student_reg_number, sr.subject_id";
        $stmt = $conn->prepare($query);

        if ($subjectId) {
            $stmt->bind_param("iiiiii", $termId, $sessionId, $termId, $sessionId, $classId, $subjectId);
        } else {
            $stmt->bind_param("iiiii", $termId, $sessionId, $termId, $sessionId, $classId);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $scores = [];
        while ($row = $result->fetch_assoc()) {
            $scores[] = $row;
        }

        echo json_encode(['scores' => $scores]);
        break;

    case 'POST':
    case 'PUT':
        $data = getInput();

        $teacher_id = isset($data['teacher_id']) && $data['teacher_id'] !== '' ? (int)$data['teacher_id'] : null;

        if (
            !isset($data['term_id']) ||
            !isset($data['session_id']) ||
            !isset($data['class_id']) ||
            !isset($data['scores']) ||
            !is_array($data['scores'])
        ) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields or invalid scores array']);
            exit;
        }

        // Convert term if string
        if (is_numeric($data['term_id'])) {
            $term_id = (int)$data['term_id'];
        } else {
            $stmtTerm = $conn->prepare("SELECT id FROM terms WHERE name = ? AND active = 1 LIMIT 1");
            $stmtTerm->bind_param("s", $data['term_id']);
            $stmtTerm->execute();
            $resTerm = $stmtTerm->get_result();

            if ($resTerm->num_rows === 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid or inactive term name: ' . $data['term_id']]);
                exit;
            }

            $termRow = $resTerm->fetch_assoc();
            $term_id = (int)$termRow['id'];
        }

        $session_id = (int)$data['session_id'];
        $class_id = (int)$data['class_id'];
        $scores = $data['scores'];

        $stmtSession = $conn->prepare("SELECT id FROM sessions WHERE id = ? LIMIT 1");
        $stmtSession->bind_param("i", $session_id);
        $stmtSession->execute();
        $resSession = $stmtSession->get_result();

        $stmtClass = $conn->prepare("SELECT id FROM classes WHERE id = ? LIMIT 1");
        $stmtClass->bind_param("i", $class_id);
        $stmtClass->execute();
        $resClass = $stmtClass->get_result();

        if ($resSession->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid session_id: ' . $session_id]);
            exit;
        }

        if ($resClass->num_rows === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid class_id: ' . $class_id]);
            exit;
        }

        $conn->begin_transaction();

        try {
            $insertedOrUpdatedCount = 0;
            $subjectIdsForLog = [];

            $stmtSelect = $conn->prepare("SELECT id FROM scores WHERE student_regNumber = ? AND subject_id = ? AND term_id = ? AND session_id = ?");
            $stmtUpdate = $conn->prepare("UPDATE scores SET ca1 = ?, ca2 = ?, exam = ?, uploaded_by_teacher_id = ?, updated_at = NOW() WHERE id = ?");
            $stmtInsert = $conn->prepare("INSERT INTO scores (student_regNumber, subject_id, term_id, class_id, session_id, ca1, ca2, exam, uploaded_by_teacher_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

            foreach ($scores as $score) {
                $student_regNumber = $score['student_regNumber'] ?? null;
                $subject_id = $score['subject_id'] ?? null;
                $ca1 = isset($score['ca1']) ? (float)$score['ca1'] : 0;
                $ca2 = isset($score['ca2']) ? (float)$score['ca2'] : 0;
                $exam = isset($score['exam']) ? (float)$score['exam'] : 0;

                if (!$student_regNumber || !$subject_id) continue;

                $subjectIdsForLog[$subject_id] = true;

                $stmtSelect->bind_param("siii", $student_regNumber, $subject_id, $term_id, $session_id);
                $stmtSelect->execute();
                $res = $stmtSelect->get_result();

                if ($res->num_rows > 0) {
                    $row = $res->fetch_assoc();
                    $score_id = $row['id'];
                    $stmtUpdate->bind_param("ddiii", $ca1, $ca2, $exam, $teacher_id, $score_id);
                    if (!$stmtUpdate->execute()) {
                        throw new Exception("Update failed for score ID $score_id: " . $stmtUpdate->error);
                    }
                } else {
                    $stmtInsert->bind_param("siiiidddi", $student_regNumber, $subject_id, $term_id, $class_id, $session_id, $ca1, $ca2, $exam, $teacher_id);
                    if (!$stmtInsert->execute()) {
                        throw new Exception("Insert failed for student $student_regNumber subject $subject_id: " . $stmtInsert->error);
                    }
                }

                $insertedOrUpdatedCount++;
            }

            $conn->commit();

            echo json_encode([
                'success' => true,
                'message' => "$insertedOrUpdatedCount scores uploaded/updated successfully",
                'subjects_affected' => array_keys($subjectIdsForLog)
            ]);
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }

        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}