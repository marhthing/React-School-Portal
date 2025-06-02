<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['class_id']) || empty($data['term']) || empty($data['session_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    $class_id = (int)$data['class_id'];
    $term = $conn->real_escape_string($data['term']); // e.g. "First Term"
    $session_id = (int)$data['session_id'];
    // $admin_id = isset($data['admin_id']) ? (int)$data['admin_id'] : null;

    // ✅ Convert term name to term_id
    $term_id_result = $conn->query("SELECT id FROM terms WHERE name = '$term' LIMIT 1");
    if ($term_id_result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(['message' => "Invalid term: $term"]);
        exit;
    }
    $term_id = (int)$term_id_result->fetch_assoc()['id'];

    // ✅ Total score per student for that class/term/session
    $query = "
        SELECT 
            s.regNumber, 
            SUM(sc.total) AS total_score 
        FROM scores sc
        JOIN students s ON s.regNumber = sc.student_regNumber
        WHERE sc.class_id = $class_id
          AND sc.term_id = $term_id 
          AND sc.session_id = $session_id
        GROUP BY s.regNumber
        ORDER BY total_score DESC
    ";
    $result = $conn->query($query);

    if (!$result || $result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'No scores found for the given class, term, and session.']);
        exit;
    }

    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    // ✅ Assign total score rank
    $rank = 1;
    $last_score = null;
    $same_rank_count = 0;

    foreach ($students as $index => $student) {
        $score = $student['total_score'];

        if ($score === $last_score) {
            $students[$index]['position'] = $rank;
            $same_rank_count++;
        } else {
            $rank += $same_rank_count;
            $students[$index]['position'] = $rank;
            $same_rank_count = 1;
        }

        $last_score = $score;
    }

    // ✅ Compute subject rank for each student per subject
    $subject_rank_data = [];

    $subject_query = "
        SELECT subject_id 
        FROM scores 
        WHERE class_id = $class_id 
          AND term_id = $term_id 
          AND session_id = $session_id 
        GROUP BY subject_id
    ";
    $subjects_result = $conn->query($subject_query);

    while ($subject_row = $subjects_result->fetch_assoc()) {
        $subject_id = $subject_row['subject_id'];

        $sub_rank_query = "
            SELECT student_regNumber, total 
            FROM scores 
            WHERE subject_id = $subject_id 
              AND class_id = $class_id 
              AND term_id = $term_id 
              AND session_id = $session_id 
            ORDER BY total DESC
        ";
        $rank_result = $conn->query($sub_rank_query);

        $rank = 1;
        $prev_score = null;
        $same_count = 0;

        while ($row = $rank_result->fetch_assoc()) {
            $reg = $row['student_regNumber'];
            $total = $row['total'];

            if ($total === $prev_score) {
                $same_count++;
            } else {
                $rank += $same_count;
                $same_count = 1;
            }

            if (!isset($subject_rank_data[$reg])) {
                $subject_rank_data[$reg] = [];
            }
            $subject_rank_data[$reg][$subject_id] = $rank;

            $prev_score = $total;
        }
    }

    // ✅ Store in results table
$stmt = $conn->prepare("
    INSERT INTO results (
        student_regNumber, class_id, term_id, session_id, 
        total_score, position, subject_rank, 
        published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE 
        total_score = VALUES(total_score),
        position = VALUES(position),
        subject_rank = VALUES(subject_rank),
        published_at = VALUES(published_at)
");


    foreach ($students as $student) {
    $reg = $student['regNumber'];
    $score = $student['total_score'];
    $pos = $student['position'];
    $sub_ranks = $subject_rank_data[$reg] ?? new stdClass(); // fallback to empty object
    $subjectRank = json_encode($sub_ranks);

    $stmt->bind_param(
        "siiiids",
        $reg, $class_id, $term_id, $session_id,
        $score, $pos, $subjectRank
    );
    $stmt->execute();
}


    $stmt->close();
    echo json_encode(['message' => "Results published successfully for class ID $class_id, term '$term' (ID $term_id), session ID $session_id."]);

} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}

$conn->close();