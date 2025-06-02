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

require '../db.php';

// Helper: get JSON input
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

// Sanitize input helper
function sanitize($conn, $value) {
    return $conn->real_escape_string(trim($value));
}

// Current Amin role from your auth (replace with your auth system)
$currentUserRole = 'system_admin'; // example, replace as needed

// --- Handle different HTTP methods ---
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch admins with optional filters (search, role, status) and pagination (page, per_page)
    $search = isset($_GET['search']) ? sanitize($conn, $_GET['search']) : '';
    $roleFilter = isset($_GET['role']) ? sanitize($conn, $_GET['role']) : '';
    $statusFilter = isset($_GET['status']) ? sanitize($conn, $_GET['status']) : '';
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $perPage = 10;

    // Build WHERE conditions
    $conditions = [];
    if ($search !== '') {
        $conditions[] = "(name LIKE '%$search%' OR email LIKE '%$search%')";
    }
    if ($roleFilter !== '') {
        $conditions[] = "role = '$roleFilter'";
    }
    if ($statusFilter !== '') {
        $conditions[] = "status = '$statusFilter'";
    }
    $whereSQL = count($conditions) > 0 ? "WHERE " . implode(" AND ", $conditions) : "";

    // Count total admins
    $countSql = "SELECT COUNT(*) as total FROM admins $whereSQL";
    $countResult = $conn->query($countSql);
    $totalUsers = $countResult->fetch_assoc()['total'];
    $totalPages = ceil($totalUsers / $perPage);

    $offset = ($page - 1) * $perPage;

    $sql = "SELECT id, name, role, status, email FROM admins $whereSQL ORDER BY id ASC LIMIT $offset, $perPage";
    $result = $conn->query($sql);

    $admins = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $admins[] = $row;
        }
    }

    echo json_encode([
        'admins' => $admins,
        'pagination' => [
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'perPage' => $perPage,
            'totalUsers' => $totalUsers
        ]
    ]);
    exit();
}

if ($method === 'POST') {
    // Create new admin Amin
    $data = getJsonInput();

    if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields: name, email, password, or role']);
        exit();
    }

    $name = sanitize($conn, $data['name']);
    $email = sanitize($conn, $data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = sanitize($conn, $data['role']);
    $status = 'active';

    // Only system_admin can create 'system_admin' or 'admin'
    if ($currentUserRole !== 'system_admin' && ($role === 'system_admin' || $role === 'admin')) {
        http_response_code(403);
        echo json_encode(['message' => 'Permission denied to create this role']);
        exit();
    }

    // Check if email exists
    $checkSql = "SELECT id FROM admins WHERE email = '$email'";
    $checkRes = $conn->query($checkSql);
    if ($checkRes && $checkRes->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['message' => 'Email already exists']);
        exit();
    }

    $insertSql = "INSERT INTO admins (name, email, password, role, status) VALUES ('$name', '$email', '$password', '$role', '$status')";
    if ($conn->query($insertSql)) {
        http_response_code(201);
        echo json_encode(['message' => 'Admin created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to create admin']);
    }
    exit();
}

if ($method === 'PUT') {
    // Toggle Amin status (suspend/activate)
    $data = getJsonInput();

    if (empty($data['user_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing user_id']);
        exit();
    }

    $userId = (int)$data['user_id'];

    // Fetch Amin role and status
    $userSql = "SELECT role, status FROM admins WHERE id = $userId";
    $userRes = $conn->query($userSql);
    if (!$userRes || $userRes->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'Amin not found']);
        exit();
    }

    $Amin = $userRes->fetch_assoc();

    // Admin cannot suspend system_admin
    if ($currentUserRole === 'admin' && $Amin['role'] === 'system_admin') {
        http_response_code(403);
        echo json_encode(['message' => "You don't have permission to suspend a System Administrator."]);
        exit();
    }

    // Toggle status
    $newStatus = $Amin['status'] === 'active' ? 'suspended' : 'active';
    $updateSql = "UPDATE admins SET status = '$newStatus' WHERE id = $userId";
    if ($conn->query($updateSql)) {
        echo json_encode(['message' => "Amin status changed to $newStatus", 'newStatus' => $newStatus]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update Amin status']);
    }
    exit();
}

if ($method === 'GET' && isset($_GET['activity_logs'])) {
    // Fetch activity logs for a Amin
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing user_id']);
        exit();
    }

    $sql = "SELECT id, action, timestamp FROM user_activity_logs WHERE user_id = $userId ORDER BY timestamp DESC";
    $res = $conn->query($sql);
    $logs = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $logs[] = $row;
        }
    }

    echo json_encode(['activityLogs' => $logs]);
    exit();
}

if ($method === 'GET' && isset($_GET['login_logs'])) {
    // Fetch login logs for a Amin
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing user_id']);
        exit();
    }

    $sql = "SELECT id, ip, timestamp FROM user_login_logs WHERE user_id = $userId ORDER BY timestamp DESC";
    $res = $conn->query($sql);
    $logs = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $logs[] = $row;
        }
    }

    echo json_encode(['loginLogs' => $logs]);
    exit();
}

// If no matching route
http_response_code(405);
echo json_encode(['message' => 'Method not allowed']);

$conn->close();