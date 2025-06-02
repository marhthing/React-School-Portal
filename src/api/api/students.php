<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require '../db.php'; // $conn mysqli connection

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

function generateRegNumber($conn) {
    $result = $conn->query("SELECT COUNT(*) as count FROM students");
    $count = $result->fetch_assoc()['count'] + 1;
    return str_pad($count, 3, '0', STR_PAD_LEFT);
}

function monthStringToInt($monthStr) {
    $months = [
        'January' => 1, 'February' => 2, 'March' => 3, 'April' => 4,
        'May' => 5, 'June' => 6, 'July' => 7, 'August' => 8,
        'September' => 9, 'October' => 10, 'November' => 11, 'December' => 12
    ];
    return $months[$monthStr] ?? null;
}

switch ($method) {
    case 'GET':
        $result = $conn->query("
            SELECT regNumber, first_name, last_name, other_name, gender, dob_day, dob_month, dob_year, class_id AS target_class,
                   phone AS contact_phone, home_address, state, nationality, 
                   sponsor_name, sponsor_phone, sponsor_relationship, password
            FROM students 
            ORDER BY regNumber ASC
        ");
        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
        echo json_encode(['students' => $students]);
        break;

    case 'POST':
        $data = getInput();

        $required = ['first_name', 'last_name', 'gender', 'dob_day', 'dob_month', 'dob_year', 'target_class', 'contact_phone'];
        foreach ($required as $field) {
            if (empty($data[$field]) && $data[$field] !== '0') {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }

        $regNumber = generateRegNumber($conn);

        $first_name = $conn->real_escape_string($data['first_name']);
        $last_name = $conn->real_escape_string($data['last_name']);
        $other_name = isset($data['other_name']) ? $conn->real_escape_string($data['other_name']) : null;
        $gender = $conn->real_escape_string($data['gender']);
        $dob_day = (int)$data['dob_day'];
        $dob_month = monthStringToInt($data['dob_month']);
        $dob_year = (int)$data['dob_year'];
        $class_id = $conn->real_escape_string($data['target_class']);
        $phone = $conn->real_escape_string($data['contact_phone']);
        $home_address = isset($data['home_address']) ? $conn->real_escape_string($data['home_address']) : null;
        $state = isset($data['state']) ? $conn->real_escape_string($data['state']) : null;
        $nationality = isset($data['nationality']) ? $conn->real_escape_string($data['nationality']) : null;
        $sponsor_name = isset($data['sponsor_name']) ? $conn->real_escape_string($data['sponsor_name']) : null;
        $sponsor_phone = isset($data['sponsor_phone']) ? $conn->real_escape_string($data['sponsor_phone']) : null;
        $sponsor_relationship = isset($data['sponsor_relationship']) ? $conn->real_escape_string($data['sponsor_relationship']) : null;

        $password = password_hash($last_name, PASSWORD_DEFAULT); // password from last name
        $active = 1;

        $sql = "INSERT INTO students 
            (regNumber, first_name, last_name, other_name, gender, dob_day, dob_month, dob_year, class_id, phone, home_address, state, nationality, sponsor_name, sponsor_phone, sponsor_relationship, password, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        $stmt = $conn->prepare($sql);

        $stmt->bind_param(
            "sssssisisssssssssi",
            $regNumber,
            $first_name,
            $last_name,
            $other_name,
            $gender,
            $dob_day,
            $dob_month,
            $dob_year,
            $class_id,
            $phone,
            $home_address,
            $state,
            $nationality,
            $sponsor_name,
            $sponsor_phone,
            $sponsor_relationship,
            $password,
            $active
        );

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'regNumber' => $regNumber]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        if (!isset($_GET['regNumber'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing regNumber in query']);
            exit;
        }
        $regNumber = $conn->real_escape_string($_GET['regNumber']);
        $data = getInput();

        $required = ['first_name', 'last_name', 'gender', 'dob_day', 'dob_month', 'dob_year', 'target_class', 'contact_phone'];
        foreach ($required as $field) {
            if (empty($data[$field]) && $data[$field] !== '0') {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }

        $first_name = $conn->real_escape_string($data['first_name']);
        $last_name = $conn->real_escape_string($data['last_name']);
        $other_name = isset($data['other_name']) ? $conn->real_escape_string($data['other_name']) : null;
        $gender = $conn->real_escape_string($data['gender']);
        $dob_day = (int)$data['dob_day'];
        $dob_month = monthStringToInt($data['dob_month']);
        $dob_year = (int)$data['dob_year'];
        $class_id = $conn->real_escape_string($data['target_class']);
        $phone = $conn->real_escape_string($data['contact_phone']);
        $home_address = isset($data['home_address']) ? $conn->real_escape_string($data['home_address']) : null;
        $state = isset($data['state']) ? $conn->real_escape_string($data['state']) : null;
        $nationality = isset($data['nationality']) ? $conn->real_escape_string($data['nationality']) : null;
        $sponsor_name = isset($data['sponsor_name']) ? $conn->real_escape_string($data['sponsor_name']) : null;
        $sponsor_phone = isset($data['sponsor_phone']) ? $conn->real_escape_string($data['sponsor_phone']) : null;
        $sponsor_relationship = isset($data['sponsor_relationship']) ? $conn->real_escape_string($data['sponsor_relationship']) : null;

        $sql = "UPDATE students SET 
                first_name = ?, last_name = ?, other_name = ?, gender = ?, 
                dob_day = ?, dob_month = ?, dob_year = ?, 
                class_id = ?, phone = ?, home_address = ?, state = ?, nationality = ?, 
                sponsor_name = ?, sponsor_phone = ?, sponsor_relationship = ?, updated_at = NOW() 
                WHERE regNumber = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiiisssssssss",
            $first_name, $last_name, $other_name, $gender, 
            $dob_day, $dob_month, $dob_year,
            $class_id, $phone, $home_address, $state, $nationality,
            $sponsor_name, $sponsor_phone, $sponsor_relationship, $regNumber
        );

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'regNumber' => $regNumber]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        if (!isset($_GET['regNumber'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing regNumber in query']);
            exit;
        }
        $regNumber = $conn->real_escape_string($_GET['regNumber']);

        $stmt = $conn->prepare("DELETE FROM students WHERE regNumber = ?");
        $stmt->bind_param("s", $regNumber);

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
?>