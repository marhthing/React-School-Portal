<?php
// school-settings.php - API to get school information
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: " . ($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173'));
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

require '../db.php';

try {
    $stmt = $conn->prepare("SELECT school_name, school_abbreviation, school_address, school_logo_url, phone, email, website, motto FROM school_settings LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    $schoolData = $result->fetch_assoc();
    $stmt->close();

    if (!$schoolData) {
        // Return default data if no settings found
        $schoolData = [
            'school_name' => 'Your School Name',
            'school_abbreviation' => 'YSN',
            'school_address' => 'School Address',
            'school_logo_url' => '/assets/logo.png',
            'phone' => '',
            'email' => '',
            'website' => '',
            'motto' => 'Excellence in Education'
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $schoolData
    ]);

} catch (Exception $e) {
    error_log("School settings error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch school information']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>