<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");  // Adjust as needed
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
    exit();
}

try {
    // Total Students
    $result = $conn->query("SELECT COUNT(*) as total_students FROM students");
    $totalStudents = ($result && $row = $result->fetch_assoc()) ? (int)$row['total_students'] : 0;

    // Total Teachers
    $result = $conn->query("SELECT COUNT(*) as total_teachers FROM teachers");
    $totalTeachers = ($result && $row = $result->fetch_assoc()) ? (int)$row['total_teachers'] : 0;

    // Current Session
    $result = $conn->query("SELECT id, name FROM sessions WHERE active = 1 LIMIT 1");
    $sessionId = null;
    $currentSession = 'N/A';
    if ($result && $row = $result->fetch_assoc()) {
        $sessionId = (int)$row['id'];
        $currentSession = $row['name'];
    }

    // Current Term
    $result = $conn->query("SELECT id, name FROM terms WHERE active = 1 LIMIT 1");
    $termId = null;
    $currentTerm = 'N/A';
    if ($result && $row = $result->fetch_assoc()) {
        $termId = (int)$row['id'];
        $currentTerm = $row['name'];
    }

    // Results Uploaded
    $result = $conn->query("SELECT COUNT(*) as results_uploaded FROM scores");
    $resultsUploaded = ($result && $row = $result->fetch_assoc()) ? (int)$row['results_uploaded'] : 0;

    // Results Published
    $result = $conn->query("SELECT COUNT(*) as results_published FROM results");
    $resultsPublished = ($result && $row = $result->fetch_assoc()) ? (int)$row['results_published'] : 0;

    // Boys vs Girls
    $boys = $girls = 0;
    $result = $conn->query("SELECT gender, COUNT(*) as count FROM students GROUP BY gender");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            if (strtolower($row['gender']) === 'male') {
                $boys = (int)$row['count'];
            } elseif (strtolower($row['gender']) === 'female') {
                $girls = (int)$row['count'];
            }
        }
    }

$recentActivities = [];
$result = $conn->query("
    SELECT
        ra.activity,
        ra.role,
        ra.created_at,
        COALESCE(
            CASE 
                WHEN ra.role IN ('admin', 'SuperAdmin') THEN a.name
                WHEN ra.role IN ('teacher', 'ClassTeacher') THEN t.name
                WHEN ra.role = 'student' THEN CONCAT(s.first_name, ' ', s.last_name)
                ELSE ra.user_name
            END
        ) AS user_name
    FROM recent_activities ra
    LEFT JOIN admins a ON (ra.role IN ('admin', 'SuperAdmin') AND ra.user_id = CAST(a.id AS CHAR))
    LEFT JOIN teachers t ON (ra.role IN ('teacher', 'ClassTeacher') AND ra.user_id = CAST(t.id AS CHAR))
    LEFT JOIN students s ON (ra.role = 'student' AND ra.user_id = s.regNumber)
    ORDER BY ra.created_at DESC
    LIMIT 10
");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $recentActivities[] = $row;
    }
}


    // Class Performance (average total_score per class for current session and term)
    $classPerformance = [];
    if ($sessionId && $termId) {
        $result = $conn->query("
            SELECT c.name AS class, ROUND(AVG(r.total_score), 2) AS avgScore
            FROM results r
            JOIN classes c ON r.class_id = c.id
            WHERE r.session_id = $sessionId AND r.term_id = $termId
            GROUP BY r.class_id
            ORDER BY c.name
        ");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $classPerformance[] = [
                    'class' => $row['class'],
                    'avgScore' => (float) $row['avgScore']
                ];
            }
        }
    }

    // Active Users (optional logic - currently hardcoded)
    $activeUsers = 0;

    // Final Response
    $response = [
        'total_students' => $totalStudents,
        'total_teachers' => $totalTeachers,
        'current_session' => $currentSession,
        'current_term' => $currentTerm,
        'results_uploaded' => $resultsUploaded,
        'results_published' => $resultsPublished,
        'boys' => $boys,
        'girls' => $girls,
        'recent_activities' => $recentActivities,
        'class_performance' => $classPerformance,
        'active_users' => $activeUsers,
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

$conn->close();