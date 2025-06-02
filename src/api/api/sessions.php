<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");  // Allow your frontend origin
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");  // If you use cookies/auth

// Handle OPTIONS preflight request and exit early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
require '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to get JSON input
function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Using prepared statements to avoid SQL injection
switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM sessions ORDER BY name");
        $sessions = [];
        while ($row = $result->fetch_assoc()) {
            $sessions[] = $row;
        }
        echo json_encode($sessions);
        break;

    case 'POST':
        $data = getInput();
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing session name']);
            exit;
        }
        $name = $data['name'];

        $stmt = $conn->prepare("INSERT INTO sessions (name) VALUES (?)");
        $stmt->bind_param("s", $name);

        if ($stmt->execute()) {
            // Return inserted session with id
            $insertedId = $stmt->insert_id;
            echo json_encode(['id' => $insertedId, 'name' => $name]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Expect id from query string, data from JSON body
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id in query']);
            exit;
        }
        $id = (int)$_GET['id'];
        $data = getInput();
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing session name']);
            exit;
        }
        $name = $data['name'];

        $stmt = $conn->prepare("UPDATE sessions SET name = ? WHERE id = ?");
        $stmt->bind_param("si", $name, $id);

        if ($stmt->execute()) {
            echo json_encode(['id' => $id, 'name' => $name]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Expect id from query string, no body needed
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id in query']);
            exit;
        }
        $id = (int)$_GET['id'];

        $stmt = $conn->prepare("DELETE FROM sessions WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
$conn->close();