<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require '../db.php';  // your mysqli connection in $conn

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    return json_decode(file_get_contents('php://input'), true);
}

function getSubjectClasses($conn, $subjectId) {
    $classes = [];
    $sql = "SELECT class_id FROM subject_classes WHERE subject_id = ?";
    $stmt = $conn->prepare($sql);
    // Using "i" here is fine for bigint values as PHP int supports 64-bit on 64-bit machines
    $stmt->bind_param("i", $subjectId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) {
        $classes[] = (int)$row['class_id'];
    }
    $stmt->close();
    return $classes;
}

function getSubjectTeachers($conn, $subjectId) {
    $teachers = [];
    $sql = "SELECT teacher_id FROM subject_teachers WHERE subject_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $subjectId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) {
        $teachers[] = (int)$row['teacher_id'];
    }
    $stmt->close();
    return $teachers;
}

function saveSubjectClasses($conn, $subjectId, $classIds) {
    // Delete existing mappings first
    $stmt = $conn->prepare("DELETE FROM subject_classes WHERE subject_id = ?");
    $stmt->bind_param("i", $subjectId);
    $stmt->execute();
    $stmt->close();

    if (!empty($classIds)) {
        $stmt = $conn->prepare("INSERT INTO subject_classes (subject_id, class_id) VALUES (?, ?)");
        foreach ($classIds as $classId) {
            $stmt->bind_param("ii", $subjectId, $classId);
            $stmt->execute();
        }
        $stmt->close();
    }
}

function saveSubjectTeachers($conn, $subjectId, $teacherIds) {
    // Delete existing mappings first
    $stmt = $conn->prepare("DELETE FROM subject_teachers WHERE subject_id = ?");
    $stmt->bind_param("i", $subjectId);
    $stmt->execute();
    $stmt->close();

    if (!empty($teacherIds)) {
        $stmt = $conn->prepare("INSERT INTO subject_teachers (subject_id, teacher_id) VALUES (?, ?)");
        foreach ($teacherIds as $teacherId) {
            $stmt->bind_param("ii", $subjectId, $teacherId);
            $stmt->execute();
        }
        $stmt->close();
    }
}

function getSubjectById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM subjects WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $subject = $result->fetch_assoc();
    $stmt->close();

    if ($subject) {
        $subject['assignedClasses'] = getSubjectClasses($conn, $id);
        $subject['assignedTeachers'] = getSubjectTeachers($conn, $id);
    }
    return $subject;
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
            if ($id === false) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid ID']);
                exit;
            }
            $subject = getSubjectById($conn, $id);
            if ($subject) {
                echo json_encode($subject, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Subject not found']);
            }
        } else {
            $result = $conn->query("SELECT * FROM subjects");
            $subjects = [];
            while ($row = $result->fetch_assoc()) {
                $row['assignedClasses'] = getSubjectClasses($conn, $row['id']);
                $row['assignedTeachers'] = getSubjectTeachers($conn, $row['id']);
                $subjects[] = $row;
            }
            echo json_encode($subjects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
        break;

    case 'POST':
        $data = getInput();
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing subject name']);
            exit;
        }

        $conn->begin_transaction();
        try {
            $name = $conn->real_escape_string($data['name']);
            $abbreviation = isset($data['abbreviation']) ? $conn->real_escape_string($data['abbreviation']) : null;
            $category = isset($data['category']) ? $conn->real_escape_string($data['category']) : null;

            $stmt = $conn->prepare("INSERT INTO subjects (name, abbreviation, category) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $abbreviation, $category);
            $stmt->execute();
            $newId = $stmt->insert_id;
            $stmt->close();

            saveSubjectClasses($conn, $newId, $data['assignedClasses'] ?? []);
            saveSubjectTeachers($conn, $newId, $data['assignedTeachers'] ?? []);

            $conn->commit();

            echo json_encode(getSubjectById($conn, $newId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (Exception $e) {
            $conn->rollback();
            error_log("POST Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save subject']);
        }
        break;

    case 'PUT':
        $id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : false;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing or invalid ID']);
            exit;
        }
        $data = getInput();
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing subject name']);
            exit;
        }

        $conn->begin_transaction();
        try {
            $name = $conn->real_escape_string($data['name']);
            $abbreviation = isset($data['abbreviation']) ? $conn->real_escape_string($data['abbreviation']) : null;
            $category = isset($data['category']) ? $conn->real_escape_string($data['category']) : null;

            $stmt = $conn->prepare("UPDATE subjects SET name = ?, abbreviation = ?, category = ? WHERE id = ?");
            $stmt->bind_param("sssi", $name, $abbreviation, $category, $id);
            $stmt->execute();
            $stmt->close();

            saveSubjectClasses($conn, $id, $data['assignedClasses'] ?? []);
            saveSubjectTeachers($conn, $id, $data['assignedTeachers'] ?? []);

            $conn->commit();

            echo json_encode(getSubjectById($conn, $id), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (Exception $e) {
            $conn->rollback();
            error_log("PUT Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update subject']);
        }
        break;

    case 'PATCH':
        $data = getInput();
        if (!isset($data['id']) || !is_array($data['assignedTeachers'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id or assignedTeachers']);
            exit;
        }

        $id = (int)$data['id'];
        saveSubjectTeachers($conn, $id, $data['assignedTeachers']);
        echo json_encode(getSubjectById($conn, $id), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : false;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing or invalid ID']);
            exit;
        }

        try {
            $conn->begin_transaction();

            $stmt = $conn->prepare("DELETE FROM subject_classes WHERE subject_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM subject_teachers WHERE subject_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM subjects WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();

            $conn->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $conn->rollback();
            error_log("DELETE Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete subject']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();