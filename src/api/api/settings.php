<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require '../db.php';


try {
    $conn->set_charset("utf8mb4");
    
    // Get request method and action
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch ($method) {
        case 'GET':
            handleGetRequest($conn, $action);
            break;
        case 'POST':
            handlePostRequest($conn, $action);
            break;
        case 'PUT':
            handlePutRequest($conn, $action);
            break;
        case 'DELETE':
            handleDeleteRequest($conn, $action);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error occurred',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}

function handleFileUpload($fileKey, $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    
    $file = $_FILES[$fileKey];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload error for {$fileKey}");
    }
    
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($fileExtension, $allowedExtensions)) {
        throw new Exception("Invalid file type for {$fileKey}. Allowed: " . implode(', ', $allowedExtensions));
    }
    
    $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
    $filePath = $uploadDir . $fileName;
    
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception("Failed to upload {$fileKey}");
    }
    
    return $fileName;
}

function handleGetRequest($conn, $action) {
    switch ($action) {
        case 'all':
            fetchAllSettings($conn);
            break;
        case 'school':
            fetchSchoolInfo($conn);
            break;
        case 'academic':
            fetchAcademicInfo($conn);
            break;
        case 'platform':
            fetchPlatformSettings($conn);
            break;
        default:
            fetchAllSettings($conn);
    }
}

function handlePostRequest($conn, $action) {
    switch ($action) {
        case 'school':
            createOrUpdateSchoolInfo($conn, 'create');
            break;
        case 'academic':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            createOrUpdateAcademicInfo($conn, $input, 'create');
            break;
        case 'platform':
            $input = json_decode(file_get_contents('php://input'), true);
            updatePlatformSettings($conn, $input);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePutRequest($conn, $action) {
    switch ($action) {
        case 'school':
            createOrUpdateSchoolInfo($conn, 'update');
            break;
        case 'academic':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                $input = $_POST;
            }
            createOrUpdateAcademicInfo($conn, $input, 'update');
            break;
        case 'platform':
            $input = json_decode(file_get_contents('php://input'), true);
            updatePlatformSettings($conn, $input);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handleDeleteRequest($conn, $action) {
    switch ($action) {
        case 'school':
            deleteSchoolInfo($conn);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid delete action']);
    }
}

function fetchAllSettings($conn) {
    $response = [
        'schoolInfo' => null,
        'academicInfo' => null,
        'platformToggles' => [
            'disable_student_login' => false,
            'maintenance_mode' => false,
            'enable_result_uploads' => true
        ]
    ];
    
    try {
        // Get school info with proper field mapping
        $schoolQuery = "SELECT * FROM school_settings WHERE id = 1";
        $schoolResult = $conn->query($schoolQuery);
        
        if ($schoolResult && $schoolResult->num_rows > 0) {
            $schoolData = $schoolResult->fetch_assoc();
            $response['schoolInfo'] = [
                'id' => $schoolData['id'],
                'full_name' => $schoolData['school_name'],
                'abbreviation' => $schoolData['school_abbreviation'],
                'address' => $schoolData['school_address'],
                'logo' => $schoolData['school_logo_url'],
                'signature' => $schoolData['school_signature_url'],
                'phone' => $schoolData['phone'],
                'email' => $schoolData['email'],
                'website' => $schoolData['website'],
                'motto' => $schoolData['motto']
            ];
        }
        
        // Get academic info using active records from sessions and terms
        $academicResponse = [];
        
        // Get active session
        $sessionQuery = "SELECT name FROM sessions WHERE active = 1 LIMIT 1";
        $sessionResult = $conn->query($sessionQuery);
        if ($sessionResult && $sessionResult->num_rows > 0) {
            $sessionData = $sessionResult->fetch_assoc();
            $academicResponse['current_session'] = $sessionData['name'];
        }
        
        // Get active term
        $termQuery = "SELECT name FROM terms WHERE active = 1 LIMIT 1";
        $termResult = $conn->query($termQuery);
        if ($termResult && $termResult->num_rows > 0) {
            $termData = $termResult->fetch_assoc();
            $academicResponse['current_term'] = $termData['name'];
        }
        
        if (!empty($academicResponse)) {
            $response['academicInfo'] = $academicResponse;
        }
        
        // Get platform settings
        $platformQuery = "SELECT * FROM settings WHERE id = 1";
        $platformResult = $conn->query($platformQuery);
        
        if ($platformResult && $platformResult->num_rows > 0) {
            $platformData = $platformResult->fetch_assoc();
            $response['platformToggles'] = [
                'disable_student_login' => (bool)$platformData['disable_student_logins'],
                'maintenance_mode' => (bool)$platformData['maintenance_mode'],
                'enable_result_uploads' => (bool)$platformData['allow_teacher_uploads']
            ];
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch settings', 'message' => $e->getMessage()]);
    }
}

function fetchSchoolInfo($conn) {
    try {
        $query = "SELECT * FROM school_settings WHERE id = 1";
        $result = $conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            $data = $result->fetch_assoc();
            $schoolInfo = [
                'id' => $data['id'],
                'full_name' => $data['school_name'],
                'abbreviation' => $data['school_abbreviation'],
                'address' => $data['school_address'],
                'logo' => $data['school_logo_url'],
                'signature' => $data['school_signature_url'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'website' => $data['website'],
                'motto' => $data['motto']
            ];
            echo json_encode(['schoolInfo' => $schoolInfo]);
        } else {
            echo json_encode(['schoolInfo' => null]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch school info', 'message' => $e->getMessage()]);
    }
}

function fetchAcademicInfo($conn) {
    try {
        $academicInfo = [];
        
        // Get active session
        $sessionQuery = "SELECT name FROM sessions WHERE active = 1 LIMIT 1";
        $sessionResult = $conn->query($sessionQuery);
        if ($sessionResult && $sessionResult->num_rows > 0) {
            $sessionData = $sessionResult->fetch_assoc();
            $academicInfo['current_session'] = $sessionData['name'];
        }
        
        // Get active term
        $termQuery = "SELECT name FROM terms WHERE active = 1 LIMIT 1";
        $termResult = $conn->query($termQuery);
        if ($termResult && $termResult->num_rows > 0) {
            $termData = $termResult->fetch_assoc();
            $academicInfo['current_term'] = $termData['name'];
        }
        
        echo json_encode(['academicInfo' => !empty($academicInfo) ? $academicInfo : null]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch academic info', 'message' => $e->getMessage()]);
    }
}

function fetchPlatformSettings($conn) {
    try {
        $query = "SELECT * FROM settings WHERE id = 1";
        $result = $conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            $data = $result->fetch_assoc();
            $response = [
                'disable_student_login' => (bool)$data['disable_student_logins'],
                'maintenance_mode' => (bool)$data['maintenance_mode'],
                'enable_result_uploads' => (bool)$data['allow_teacher_uploads']
            ];
            echo json_encode(['platformToggles' => $response]);
        } else {
            echo json_encode(['platformToggles' => [
                'disable_student_login' => false,
                'maintenance_mode' => false,
                'enable_result_uploads' => true
            ]]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch platform settings', 'message' => $e->getMessage()]);
    }
}

function createOrUpdateSchoolInfo($conn, $mode) {
    try {
        // Handle file uploads
        $logoFileName = handleFileUpload('school_logo');
        $signatureFileName = handleFileUpload('school_signature');
        
        // Get form data
        $schoolName = $_POST['school_full_name'] ?? '';
        $abbreviation = $_POST['school_abbreviation'] ?? '';
        $address = $_POST['school_address'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $email = $_POST['email'] ?? '';
        $website = $_POST['website'] ?? '';
        $motto = $_POST['motto'] ?? '';
        
        if ($mode === 'create') {
            // Check if record exists
            $checkQuery = "SELECT id FROM school_settings WHERE id = 1";
            $checkResult = $conn->query($checkQuery);
            
            if ($checkResult && $checkResult->num_rows > 0) {
                // Record exists, update instead
                $mode = 'update';
            }
        }
        
        if ($mode === 'create') {
            $query = "INSERT INTO school_settings (id, school_name, school_abbreviation, school_address, phone, email, website, motto";
            $values = "VALUES (1, ?, ?, ?, ?, ?, ?, ?";
            $params = [$schoolName, $abbreviation, $address, $phone, $email, $website, $motto];
            $types = "sssssss";
            
            if ($logoFileName) {
                $query .= ", school_logo_url";
                $values .= ", ?";
                $params[] = $logoFileName;
                $types .= "s";
            }
            
            if ($signatureFileName) {
                $query .= ", school_signature_url";
                $values .= ", ?";
                $params[] = $signatureFileName;
                $types .= "s";
            }
            
            $query .= ") " . $values . ")";
            
        } else {
            $query = "UPDATE school_settings SET school_name = ?, school_abbreviation = ?, school_address = ?, phone = ?, email = ?, website = ?, motto = ?";
            $params = [$schoolName, $abbreviation, $address, $phone, $email, $website, $motto];
            $types = "sssssss";
            
            if ($logoFileName) {
                $query .= ", school_logo_url = ?";
                $params[] = $logoFileName;
                $types .= "s";
            }
            
            if ($signatureFileName) {
                $query .= ", school_signature_url = ?";
                $params[] = $signatureFileName;
                $types .= "s";
            }
            
            $query .= " WHERE id = 1";
        }
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'School information saved successfully']);
        } else {
            throw new Exception('Failed to save school information');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save school info', 'message' => $e->getMessage()]);
    }
}

function createOrUpdateAcademicInfo($conn, $input, $mode) {
    try {
        $currentSession = $input['current_session'] ?? '';
        $currentTerm = $input['current_term'] ?? '';
        
        // Start transaction
        $conn->begin_transaction();
        
        // Update sessions - set all to inactive first, then activate the selected one
        $conn->query("UPDATE sessions SET active = 0");
        
        // Check if session exists, create if not
        $sessionCheckQuery = "SELECT id FROM sessions WHERE name = ?";
        $stmt = $conn->prepare($sessionCheckQuery);
        $stmt->bind_param("s", $currentSession);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 0) {
            // Create new session
            $insertSessionQuery = "INSERT INTO sessions (name, active) VALUES (?, 1)";
            $stmt = $conn->prepare($insertSessionQuery);
            $stmt->bind_param("s", $currentSession);
            $stmt->execute();
        } else {
            // Activate existing session
            $updateSessionQuery = "UPDATE sessions SET active = 1 WHERE name = ?";
            $stmt = $conn->prepare($updateSessionQuery);
            $stmt->bind_param("s", $currentSession);
            $stmt->execute();
        }
        
        // Update terms - set all to inactive first, then activate the selected one
        $conn->query("UPDATE terms SET active = 0");
        
        // Check if term exists, create if not
        $termCheckQuery = "SELECT id FROM terms WHERE name = ?";
        $stmt = $conn->prepare($termCheckQuery);
        $stmt->bind_param("s", $currentTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows == 0) {
            // Create new term
            $insertTermQuery = "INSERT INTO terms (name, active) VALUES (?, 1)";
            $stmt = $conn->prepare($insertTermQuery);
            $stmt->bind_param("s", $currentTerm);
            $stmt->execute();
        } else {
            // Activate existing term
            $updateTermQuery = "UPDATE terms SET active = 1 WHERE name = ?";
            $stmt = $conn->prepare($updateTermQuery);
            $stmt->bind_param("s", $currentTerm);
            $stmt->execute();
        }
        
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Academic information saved successfully']);
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save academic info', 'message' => $e->getMessage()]);
    }
}

function updatePlatformSettings($conn, $input) {
    try {
        $validKeys = ['disable_student_login', 'maintenance_mode', 'enable_result_uploads'];
        $dbKeys = [
            'disable_student_login' => 'disable_student_logins',
            'maintenance_mode' => 'maintenance_mode',
            'enable_result_uploads' => 'allow_teacher_uploads'
        ];
        
        // Ensure settings record exists
        $checkQuery = "SELECT id FROM settings WHERE id = 1";
        $checkResult = $conn->query($checkQuery);
        
        if (!$checkResult || $checkResult->num_rows == 0) {
            // Create default settings record
            $createQuery = "INSERT INTO settings (id, disable_student_logins, maintenance_mode, allow_teacher_uploads) VALUES (1, 0, 0, 1)";
            $conn->query($createQuery);
        }
        
        foreach ($input as $key => $value) {
            if (in_array($key, $validKeys)) {
                $dbKey = $dbKeys[$key];
                $query = "UPDATE settings SET {$dbKey} = ? WHERE id = 1";
                $stmt = $conn->prepare($query);
                $intValue = $value ? 1 : 0;
                $stmt->bind_param("i", $intValue);
                $stmt->execute();
            }
        }
        
        echo json_encode(['success' => true, 'message' => 'Platform settings updated successfully']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update platform settings', 'message' => $e->getMessage()]);
    }
}

function deleteSchoolInfo($conn) {
    try {
        // Get current files to delete them
        $query = "SELECT school_logo_url, school_signature_url FROM school_settings WHERE id = 1";
        $result = $conn->query($query);
        
        if ($result && $result->num_rows > 0) {
            $data = $result->fetch_assoc();
            
            // Delete files
            if ($data['school_logo_url'] && file_exists('../uploads/' . $data['school_logo_url'])) {
                unlink('../uploads/' . $data['school_logo_url']);
            }
            if ($data['school_signature_url'] && file_exists('../uploads/' . $data['school_signature_url'])) {
                unlink('../uploads/' . $data['school_signature_url']);
            }
        }
        
        // Delete record
        $deleteQuery = "DELETE FROM school_settings WHERE id = 1";
        if ($conn->query($deleteQuery)) {
            echo json_encode(['success' => true, 'message' => 'School information deleted successfully']);
        } else {
            throw new Exception('Failed to delete school information');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete school info', 'message' => $e->getMessage()]);
    }
}
?>