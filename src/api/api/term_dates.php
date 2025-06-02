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

// Helper function to get current active term and session
function getCurrentTermAndSession($conn) {
    // Get current active term
    $termStmt = $conn->prepare("SELECT id, name FROM terms WHERE active = 1 LIMIT 1");
    $termStmt->execute();
    $termResult = $termStmt->get_result();
    $currentTerm = $termResult->fetch_assoc();
    $termStmt->close();
    
    // Get current active session
    $sessionStmt = $conn->prepare("SELECT id, name FROM sessions WHERE active = 1 LIMIT 1");
    $sessionStmt->execute();
    $sessionResult = $sessionStmt->get_result();
    $currentSession = $sessionResult->fetch_assoc();
    $sessionStmt->close();
    
    return [$currentTerm, $currentSession];
}

if ($method === 'GET') {
    list($currentTerm, $currentSession) = getCurrentTermAndSession($conn);
    
    if (!$currentTerm || !$currentSession) {
        echo json_encode([
            'endOfTerm' => '', 
            'nextTermStart' => '',
            'error' => 'No active term or session found'
        ]);
        exit();
    }
    
    $stmt = $conn->prepare("SELECT end_of_term_date, next_term_start_date FROM term_dates WHERE session_id = ? AND term_id = ? LIMIT 1");
    $stmt->bind_param("ii", $currentSession['id'], $currentTerm['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $dates = [
            'endOfTerm' => $row['end_of_term_date'],
            'nextTermStart' => $row['next_term_start_date'],
            'currentTerm' => $currentTerm['name'],
            'currentSession' => $currentSession['name']
        ];
    } else {
        $dates = [
            'endOfTerm' => '', 
            'nextTermStart' => '',
            'currentTerm' => $currentTerm['name'],
            'currentSession' => $currentSession['name']
        ];
    }
    
    echo json_encode($dates);
    $stmt->close();
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $endOfTerm = isset($data['endOfTerm']) ? $conn->real_escape_string($data['endOfTerm']) : null;
    $nextTermStart = isset($data['nextTermStart']) ? $conn->real_escape_string($data['nextTermStart']) : null;

    if (!$endOfTerm || !$nextTermStart) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields: endOfTerm and nextTermStart']);
        exit();
    }

    list($currentTerm, $currentSession) = getCurrentTermAndSession($conn);
    
    if (!$currentTerm || !$currentSession) {
        http_response_code(400);
        echo json_encode(['message' => 'No active term or session found']);
        exit();
    }

    $term_id = $currentTerm['id'];
    $session_id = $currentSession['id'];

    // Check if record exists for current session and term
    $stmt = $conn->prepare("SELECT id FROM term_dates WHERE session_id = ? AND term_id = ? LIMIT 1");
    $stmt->bind_param("ii", $session_id, $term_id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($existing) {
        // Update existing record
        $stmt = $conn->prepare("UPDATE term_dates SET end_of_term_date = ?, next_term_start_date = ? WHERE id = ?");
        $stmt->bind_param("ssi", $endOfTerm, $nextTermStart, $existing['id']);
    } else {
        // Insert new record
        $stmt = $conn->prepare("INSERT INTO term_dates (session_id, term_id, end_of_term_date, next_term_start_date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiss", $session_id, $term_id, $endOfTerm, $nextTermStart);
    }

    if ($stmt->execute()) {
        $id = $existing['id'] ?? $stmt->insert_id;
        
        // Fetch and return the updated record
        $fetch_stmt = $conn->prepare("SELECT end_of_term_date, next_term_start_date FROM term_dates WHERE id = ?");
        $fetch_stmt->bind_param("i", $id);
        $fetch_stmt->execute();
        $result = $fetch_stmt->get_result();
        $row = $result->fetch_assoc();
        
        $response = [
            'endOfTerm' => $row['end_of_term_date'],
            'nextTermStart' => $row['next_term_start_date'],
            'currentTerm' => $currentTerm['name'],
            'currentSession' => $currentSession['name'],
            'message' => 'Term dates saved successfully for ' . $currentTerm['name'] . ' - ' . $currentSession['name']
        ];
        
        echo json_encode($response);
        $fetch_stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to save term dates: ' . $stmt->error]);
    }
    $stmt->close();
    
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}

$conn->close();
?>