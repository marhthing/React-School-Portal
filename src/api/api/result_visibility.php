<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Return all visibility data for classes and students
    $classesResult = $conn->query("
        SELECT rvc.*, c.name as class_name, t.name as term_name, s.name as session_name
        FROM result_visibility_controls rvc
        LEFT JOIN classes c ON rvc.class_id = c.id
        LEFT JOIN terms t ON rvc.term_id = t.id
        LEFT JOIN sessions s ON rvc.session_id = s.id
        ORDER BY rvc.class_id, rvc.term_id, rvc.session_id
    ");
    
    $studentsResult = $conn->query("
        SELECT rvs.*, 
               CONCAT(st.first_name, ' ', st.last_name, IFNULL(CONCAT(' ', st.other_name), '')) as student_name,
               t.name as term_name, 
               se.name as session_name
        FROM result_visibility_students rvs
        LEFT JOIN students st ON rvs.student_regNumber = st.regNumber
        LEFT JOIN terms t ON rvs.term_id = t.id
        LEFT JOIN sessions se ON rvs.session_id = se.id
        ORDER BY rvs.student_regNumber, rvs.term_id, rvs.session_id
    ");

    if (!$classesResult || !$studentsResult) {
        http_response_code(500);
        echo json_encode(['error' => 'DB Error: ' . $conn->error]);
        exit;
    }

    $classVisibility = [];
    while ($row = $classesResult->fetch_assoc()) {
        $classVisibility[] = $row;
    }

    $studentVisibility = [];
    while ($row = $studentsResult->fetch_assoc()) {
        $studentVisibility[] = $row;
    }

    echo json_encode([
        'success' => true,
        'class_visibility' => $classVisibility,
        'student_visibility' => $studentVisibility,
    ]);

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }

    // Process class visibility updates if provided
    $classUpdates = $data['class_visibility'] ?? [];
    $studentUpdates = $data['student_visibility'] ?? [];

    // For transaction safety
    $conn->begin_transaction();

    try {
        $processedClasses = [];
        $processedStudents = [];

        // Handle class visibility updates
        foreach ($classUpdates as $cv) {
            $class_id = isset($cv['class_id']) ? (int)$cv['class_id'] : null;
            $term = isset($cv['term']) ? $conn->real_escape_string($cv['term']) : null;
            $session_id = isset($cv['session_id']) ? (int)$cv['session_id'] : null;
            $visible = isset($cv['visible']) ? (int)$cv['visible'] : 0;

            if (!$class_id || !$term || !$session_id) {
                throw new Exception('Missing required fields in class visibility update');
            }

            // Convert term name to term_id
            $term_id_result = $conn->query("SELECT id FROM terms WHERE name = '$term' LIMIT 1");
            if (!$term_id_result || $term_id_result->num_rows === 0) {
                throw new Exception("Invalid term: $term");
            }
            $term_row = $term_id_result->fetch_assoc();
            $term_id = (int)$term_row['id'];

            // Check existing record using term_id, not term string
            $check_sql = "SELECT id FROM result_visibility_controls WHERE class_id = $class_id AND term_id = $term_id AND session_id = $session_id LIMIT 1";
            $existing = $conn->query($check_sql);
            if (!$existing) {
                throw new Exception('DB Error: ' . $conn->error);
            }

            if ($existing->num_rows > 0) {
                $row = $existing->fetch_assoc();
                $stmt = $conn->prepare("UPDATE result_visibility_controls SET visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->bind_param("ii", $visible, $row['id']);
            } else {
                $stmt = $conn->prepare("INSERT INTO result_visibility_controls (class_id, term_id, session_id, visible) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("iiii", $class_id, $term_id, $session_id, $visible);
            }

            if (!$stmt->execute()) {
                throw new Exception('DB Error on class visibility update: ' . $stmt->error);
            }
            
            // Track processed record for response
            $processedClasses[] = [
                'class_id' => $class_id,
                'term_id' => $term_id,
                'session_id' => $session_id,
                'visible' => $visible
            ];
            
            $stmt->close();
        }

        // Handle student visibility updates
        foreach ($studentUpdates as $sv) {
            $student_regNumber = isset($sv['student_regNumber']) ? $sv['student_regNumber'] : null;
            $term = isset($sv['term']) ? $conn->real_escape_string($sv['term']) : null;
            $session_id = isset($sv['session_id']) ? (int)$sv['session_id'] : null;
            $visible = isset($sv['visible']) ? (int)$sv['visible'] : 0;

            if (!$student_regNumber || !$term || !$session_id) {
                throw new Exception('Missing required fields in student visibility update');
            }

            // Convert term name to term_id
            $term_id_result = $conn->query("SELECT id FROM terms WHERE name = '$term' LIMIT 1");
            if (!$term_id_result || $term_id_result->num_rows === 0) {
                throw new Exception("Invalid term: $term");
            }
            $term_row = $term_id_result->fetch_assoc();
            $term_id = (int)$term_row['id'];

            // Escape student_regNumber for SQL safety
            $escaped_student_regNumber = $conn->real_escape_string($student_regNumber);

            // Check existing record using term_id and student_regNumber
            $check_sql = "SELECT id FROM result_visibility_students WHERE student_regNumber = '$escaped_student_regNumber' AND term_id = $term_id AND session_id = $session_id LIMIT 1";
            $existing = $conn->query($check_sql);
            if (!$existing) {
                throw new Exception('DB Error: ' . $conn->error);
            }

            if ($existing->num_rows > 0) {
                $row = $existing->fetch_assoc();
                $stmt = $conn->prepare("UPDATE result_visibility_students SET visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->bind_param("ii", $visible, $row['id']);
            } else {
                $stmt = $conn->prepare("INSERT INTO result_visibility_students (student_regNumber, term_id, session_id, visible) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("siii", $student_regNumber, $term_id, $session_id, $visible);
            }

            if (!$stmt->execute()) {
                throw new Exception('DB Error on student visibility update: ' . $stmt->error);
            }
            
            // Track processed record for response
            $processedStudents[] = [
                'student_regNumber' => $student_regNumber,
                'term_id' => $term_id,
                'session_id' => $session_id,
                'visible' => $visible
            ];
            
            $stmt->close();
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Visibility settings updated successfully',
            'processed_classes' => $processedClasses,
            'processed_students' => $processedStudents
        ]);

    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error updating visibility settings: ' . $e->getMessage()
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

$conn->close();
?>