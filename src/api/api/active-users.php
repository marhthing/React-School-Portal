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

// File-based storage for active users
$activeUsersFile = '../data/active_users.json';

// Ensure data directory exists
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

function getActiveUsers() {
    global $activeUsersFile;
    if (!file_exists($activeUsersFile)) {
        return [];
    }
    $data = file_get_contents($activeUsersFile);
    $decoded = json_decode($data, true);
    return is_array($decoded) ? $decoded : [];
}

function saveActiveUsers($users) {
    global $activeUsersFile;
    // Create backup before saving
    if (file_exists($activeUsersFile)) {
        copy($activeUsersFile, $activeUsersFile . '.backup');
    }
    
    $result = file_put_contents($activeUsersFile, json_encode($users, JSON_PRETTY_PRINT));
    if ($result === false) {
        error_log("Failed to save active users to file: $activeUsersFile");
    }
    return $result !== false;
}

function cleanupExpiredUsers($users) {
    $now = time();
    $expireTime = 90; // 90 seconds timeout (increased from 60)
    
    $activeUsers = [];
    foreach ($users as $sessionId => $user) {
        if (($now - $user['last_seen']) < $expireTime) {
            $activeUsers[$sessionId] = $user;
        }
    }
    
    return $activeUsers;
}

function logActivity($action, $sessionId, $userData = []) {
    $logFile = '../data/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $userInfo = isset($userData['name']) ? $userData['name'] : 'Unknown';
    $role = isset($userData['role']) ? $userData['role'] : 'unknown';
    $route = isset($userData['current_route']) ? $userData['current_route'] : 'unknown';
    
    $logEntry = "[$timestamp] $action - Session: $sessionId, User: $userInfo ($role), Route: $route\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input: ' . json_last_error_msg());
    }
    
    $action = $input['action'] ?? '';
    $sessionId = $input['session_id'] ?? '';
    
    if (empty($action)) {
        throw new Exception('Action required');
    }
    
    // Load and cleanup expired users
    $activeUsers = getActiveUsers();
    $activeUsers = cleanupExpiredUsers($activeUsers);
    
    switch ($action) {
        case 'register':
            if (empty($sessionId)) {
                throw new Exception('Session ID required for registration');
            }
            
            $userData = $input['user_data'] ?? [];
            $activeUsers[$sessionId] = [
                'session_id' => $sessionId,
                'role' => $userData['role'] ?? 'unknown',
                'name' => $userData['name'] ?? 'Anonymous',
                'last_seen' => time(),
                'registered_at' => time(),
                'current_route' => $userData['current_route'] ?? '/',
                'user_agent' => $userData['user_agent'] ?? '',
                'status' => 'active'
            ];
            
            logActivity('REGISTER', $sessionId, $userData);
            break;
            
        case 'heartbeat':
            if (empty($sessionId)) {
                throw new Exception('Session ID required for heartbeat');
            }
            
            if (isset($activeUsers[$sessionId])) {
                $activeUsers[$sessionId]['last_seen'] = time();
                $activeUsers[$sessionId]['status'] = $input['status'] ?? 'active';
                
                // Update route if provided
                if (isset($input['current_route'])) {
                    $activeUsers[$sessionId]['current_route'] = $input['current_route'];
                }
            } else {
                // Session not found, might have expired - log this
                error_log("Heartbeat received for unknown session: $sessionId");
                
                // Return error to trigger re-registration on client side
                throw new Exception('Session not found - please refresh');
            }
            break;
            
        case 'unregister':
            if (empty($sessionId)) {
                throw new Exception('Session ID required for unregistration');
            }
            
            if (isset($activeUsers[$sessionId])) {
                $userData = $activeUsers[$sessionId];
                unset($activeUsers[$sessionId]);
                logActivity('UNREGISTER', $sessionId, $userData);
            }
            break;
            
        case 'get_count':
            // Just return current count - no session ID required
            break;
            
        case 'get_users':
            // Return list of active users (admin only)
            $userList = array_values($activeUsers);
            echo json_encode([
                'success' => true,
                'active_count' => count($activeUsers),
                'users' => $userList
            ]);
            exit;
            
        default:
            throw new Exception('Invalid action: ' . $action);
    }
    
    // Save updated users list
    if (!saveActiveUsers($activeUsers)) {
        throw new Exception('Failed to save active users data');
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'active_count' => count($activeUsers),
        'timestamp' => time(),
        'session_id' => $sessionId
    ]);
    
} catch (Exception $e) {
    error_log("Active users API error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => time()
    ]);
}
?>