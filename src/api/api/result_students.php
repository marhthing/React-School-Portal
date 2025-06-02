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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get parameters from query string
$term = isset($_GET['term']) ? $_GET['term'] : null;
$session_id = isset($_GET['session_id']) ? (int)$_GET['session_id'] : null;
$class_id = isset($_GET['class_id']) ? (int)$_GET['class_id'] : null;

// Validate required parameters
if (!$term || !$session_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters: term and session_id']);
    exit;
}

try {
    // Convert term name to term_id
    $escaped_term = $conn->real_escape_string($term);
    $term_id_result = $conn->query("SELECT id FROM terms WHERE name = '$escaped_term' LIMIT 1");
    
    if (!$term_id_result || $term_id_result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(['error' => "Invalid term: $term"]);
        exit;
    }
    
    $term_row = $term_id_result->fetch_assoc();
    $term_id = (int)$term_row['id'];

    // Build the query to get students from results table with their visibility status
    $query = "
        SELECT DISTINCT 
            r.student_regNumber as regNumber,
            r.class_id,
            CONCAT(s.first_name, ' ', s.last_name, IFNULL(CONCAT(' ', s.other_name), '')) as student_name,
            c.name as class_name,
            s.first_name,
            s.last_name,
            s.other_name,
            CASE WHEN rvs.visible = 1 THEN 1 ELSE 0 END as is_visible
        FROM results r
        LEFT JOIN students s ON r.student_regNumber = s.regNumber
        LEFT JOIN classes c ON r.class_id = c.id
        LEFT JOIN result_visibility_students rvs ON (
            rvs.student_regNumber = r.student_regNumber 
            AND rvs.term_id = r.term_id 
            AND rvs.session_id = r.session_id
        )
        WHERE r.term_id = ? AND r.session_id = ?
    ";

    // Add class filter if provided
    if ($class_id) {
        $query .= " AND r.class_id = ?";
    }

    $query .= " ORDER BY c.name, s.first_name, s.last_name";

    // Prepare and execute query
    $stmt = $conn->prepare($query);
    
    if ($class_id) {
        $stmt->bind_param("iii", $term_id, $session_id, $class_id);
    } else {
        $stmt->bind_param("ii", $term_id, $session_id);
    }

    if (!$stmt->execute()) {
        throw new Exception('DB Error: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    $students = [];

    while ($row = $result->fetch_assoc()) {
        // Only include students that have actual student records
        if ($row['student_name'] && trim($row['student_name']) !== '') {
            $students[] = [
                'regNumber' => $row['regNumber'],
                'student_name' => $row['student_name'],
                'fullName' => $row['student_name'], // Add fullName for compatibility
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'other_name' => $row['other_name'],
                'class_id' => $row['class_id'],
                'class_name' => $row['class_name'],
                'is_visible' => (bool)$row['is_visible'] // Convert to boolean
            ];
        }
    }

    $stmt->close();

    // Get summary statistics
    $total_count = count($students);
    $visible_count = count(array_filter($students, function($student) {
        return $student['is_visible'];
    }));

    // Group students by class for additional insights
    $by_class = [];
    foreach ($students as $student) {
        $class_name = $student['class_name'];
        if (!isset($by_class[$class_name])) {
            $by_class[$class_name] = [
                'class_id' => $student['class_id'],
                'class_name' => $class_name,
                'total_students' => 0,
                'visible_students' => 0
            ];
        }
        $by_class[$class_name]['total_students']++;
        if ($student['is_visible']) {
            $by_class[$class_name]['visible_students']++;
        }
    }

    echo json_encode([
        'success' => true,
        'students' => $students,
        'term' => $term,
        'term_id' => $term_id,
        'session_id' => $session_id,
        'class_id' => $class_id,
        'summary' => [
            'total_count' => $total_count,
            'visible_count' => $visible_count,
            'hidden_count' => $total_count - $visible_count,
            'classes' => array_values($by_class)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error fetching students: ' . $e->getMessage()
    ]);
}

$conn->close();
?>