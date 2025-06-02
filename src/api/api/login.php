<?php
// Optimized login.php with better performance and security
error_reporting(0); // Suppress error output to prevent data leaks
ini_set('display_errors', 0);

// Secure session configuration
session_set_cookie_params([
    'lifetime' => 3600, // 1 hour
    'path' => '/',
    'domain' => '',
    'secure' => false, // Set to true in production with HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

// Headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: " . ($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173'));
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

require '../db.php';

// Rate limiting (simple implementation)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_limit_key = "login_attempts_" . $ip;

// Check if too many attempts (implement Redis/Memcached for production)
if (isset($_SESSION[$rate_limit_key]) && $_SESSION[$rate_limit_key] > 5) {
    if (time() - $_SESSION[$rate_limit_key . '_time'] < 300) { // 5 minutes lockout
        http_response_code(429);
        echo json_encode(['status' => 'error', 'message' => 'Too many login attempts. Please try again later.']);
        exit();
    } else {
        unset($_SESSION[$rate_limit_key], $_SESSION[$rate_limit_key . '_time']);
    }
}

// Get and validate input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($data['identifier']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
    exit();
}

$identifier = trim($data['identifier']);
$password = trim($data['password']);

// Input validation
if (strlen($identifier) < 3 || strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials format']);
    exit();
}

try {
    // Single query to get settings
    $settingsStmt = $conn->prepare("SELECT disable_student_logins, maintenance_mode FROM settings LIMIT 1");
    $settingsStmt->execute();
    $settingsResult = $settingsStmt->get_result();
    $settings = $settingsResult->fetch_assoc() ?? ['disable_student_logins' => 0, 'maintenance_mode' => 0];
    $settingsStmt->close();

    // Function to attempt login for different user types
    function attemptLogin($conn, $identifier) {
        // Try students first (most common)
        $stmt = $conn->prepare("SELECT regNumber as id, CONCAT(first_name, ' ', last_name) as name, password, 'student' as role FROM students WHERE regNumber = ? AND active = 1 LIMIT 1");
        $stmt->bind_param("s", $identifier);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        if ($user) return $user;

        // Try teachers by email
        $stmt = $conn->prepare("SELECT id, name, password, 'teacher' as role FROM teachers WHERE email = ? AND active = 1 LIMIT 1");
        $stmt->bind_param("s", $identifier);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        if ($user) return $user;

        // Try admins by email
        $stmt = $conn->prepare("SELECT id, name, password, role FROM admins WHERE email = ? AND active = 1 LIMIT 1");
        $stmt->bind_param("s", $identifier);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        return $user;
    }

    $user = attemptLogin($conn, $identifier);

    if (!$user) {
        // Increment failed attempts
        $_SESSION[$rate_limit_key] = ($_SESSION[$rate_limit_key] ?? 0) + 1;
        $_SESSION[$rate_limit_key . '_time'] = time();
        
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        exit();
    }

    // Ensure role is properly set and lowercase
    $role = strtolower(trim($user['role']));
    
    // Debug logging (remove in production)
    error_log("Debug - User ID: " . $user['id'] . ", Name: " . $user['name'] . ", Role: '" . $role . "'");

    // Check system status
    if ($settings['maintenance_mode'] == 1 && $role !== 'admin') {
        http_response_code(503);
        echo json_encode(['status' => 'error', 'message' => 'System is under maintenance']);
        exit();
    }

    if ($settings['disable_student_logins'] == 1 && $role === 'student') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Student login is temporarily disabled']);
        exit();
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        // Increment failed attempts
        $_SESSION[$rate_limit_key] = ($_SESSION[$rate_limit_key] ?? 0) + 1;
        $_SESSION[$rate_limit_key . '_time'] = time();
        
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        exit();
    }

    // Clear rate limiting on successful login
    unset($_SESSION[$rate_limit_key], $_SESSION[$rate_limit_key . '_time']);

    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $role;
    $_SESSION['login_time'] = time();

    // Log activity with proper user information
    // Using explicit values to ensure data is saved correctly
    $userId = $user['id'];
    $userName = $user['name'];
    $userRole = $role;
    
    // Debug the values before insertion
    error_log("Before insert - User ID: '$userId', Name: '$userName', Role: '$userRole'");
    
    $activityStmt = $conn->prepare("INSERT INTO recent_activities (user_id, user_name, role, activity, created_at) VALUES (?, ?, ?, ?, NOW())");
    if ($activityStmt) {
        $activity = 'logged in';
        $activityStmt->bind_param("ssss", $userId, $userName, $userRole, $activity);
        
        if ($activityStmt->execute()) {
            error_log("Activity logged successfully");
        } else {
            error_log("Activity logging failed: " . $activityStmt->error);
        }
        
        $activityStmt->close();
    } else {
        error_log("Failed to prepare activity statement: " . $conn->error);
    }

    // Prepare response
    $response = [
        'status' => 'success',
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'role' => $role
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    // Log error securely (implement proper logging in production)
    error_log("Login error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>