<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");  // Adjust your frontend origin
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require '../db.php';  // Your mysqli connection ($conn)

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

switch ($method) {
    case 'GET':
        // Fetch all teachers
        $result = $conn->query("SELECT id, name AS fullName, gender, role, phone, email, password FROM teachers ORDER BY id ASC");
        $teachers = [];
        while ($row = $result->fetch_assoc()) {
            $teachers[] = $row;
        }
        echo json_encode(['teachers' => $teachers]);
        break;

    case 'POST':
        $data = getInput();

        if (empty($data['fullName']) || empty($data['gender']) || empty($data['role']) || empty($data['phone']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $name = $conn->real_escape_string($data['fullName']); // map to 'name'
        $gender = $conn->real_escape_string($data['gender']);
        $role = $conn->real_escape_string($data['role']);
        $phone = $conn->real_escape_string($data['phone']);
        $email = $conn->real_escape_string($data['email']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO teachers (name, gender, role, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $name, $gender, $role, $phone, $email, $password);

        if ($stmt->execute()) {
            $inserted_id = $stmt->insert_id;
            echo json_encode(['success' => true, 'id' => $inserted_id]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id in query']);
            exit;
        }
        $id = (int)$_GET['id'];
        $data = getInput();

        if (empty($data['fullName']) || empty($data['gender']) || empty($data['role']) || empty($data['phone']) || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $name = $conn->real_escape_string($data['fullName']);
        $gender = $conn->real_escape_string($data['gender']);
        $role = $conn->real_escape_string($data['role']);
        $phone = $conn->real_escape_string($data['phone']);
        $email = $conn->real_escape_string($data['email']);

        if (!empty($data['password'])) {
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $sql = "UPDATE teachers SET name = ?, gender = ?, role = ?, phone = ?, email = ?, password = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssssi", $name, $gender, $role, $phone, $email, $password, $id);
        } else {
            $sql = "UPDATE teachers SET name = ?, gender = ?, role = ?, phone = ?, email = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssi", $name, $gender, $role, $phone, $email, $id);
        }

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $id]);
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

        $stmt = $conn->prepare("DELETE FROM teachers WHERE id = ?");
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