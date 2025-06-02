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

function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Helper to convert input category to valid stream ENUM value
function formatStream($str) {
    $str = strtolower(trim($str));
    if ($str === 'science') return 'Science';
    if ($str === 'art') return 'Art';
    return 'None';  // default fallback
}

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT id, name, stream FROM classes ORDER BY name");
        $classes = [];
        while ($row = $result->fetch_assoc()) {
            // Return 'category' as legacy field for frontend compatibility
            $row['category'] = $row['stream'];
            unset($row['stream']);
            $classes[] = $row;
        }
        echo json_encode($classes);
        break;

    case 'POST':
        $data = getInput();
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing name']);
            exit;
        }

        $name = strtoupper($conn->real_escape_string($data['name']));
        $stream = 'None';  // default
        if (isset($data['category'])) {
            $stream = formatStream($data['category']);
        }
        $stream = $conn->real_escape_string($stream);

        $sql = "INSERT INTO classes (name, stream) VALUES ('$name', '$stream')";
        if ($conn->query($sql)) {
            $inserted_id = $conn->insert_id;
            echo json_encode(['success' => true, 'id' => $inserted_id, 'name' => $name, 'category' => $stream]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $conn->error]);
        }
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id in query']);
            exit;
        }
        $id = (int)$_GET['id'];
        $data = getInput();

        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing class name']);
            exit;
        }

        $name = strtoupper($data['name']);
        $stream = 'None';  // default
        if (isset($data['category'])) {
            $stream = formatStream($data['category']);
        }

        $stmt = $conn->prepare("UPDATE classes SET name = ?, stream = ? WHERE id = ?");
        $stmt->bind_param("ssi", $name, $stream, $id);

        if ($stmt->execute()) {
            echo json_encode([
                'id' => $id,
                'name' => $name,
                'category' => $stream
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id in query']);
            exit;
        }
        $id = (int)$_GET['id'];

        $stmt = $conn->prepare("DELETE FROM classes WHERE id = ?");
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