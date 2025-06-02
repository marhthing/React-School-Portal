<?php
// File: api/add_student.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once "../db.php"; // Adjust path based on your structure

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

$required_fields = [
    "gender", "first_name", "last_name", "dob",
    "contact_phone", "home_address", "state", "nationality",
    "sponsor_name", "sponsor_phone", "sponsor_relationship", "targeted_class"
];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        echo json_encode(["success" => false, "message" => "$field is required"]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO students (
            gender, first_name, last_name, other_name, dob,
            contact_phone, home_address, state, nationality,
            sponsor_name, sponsor_phone, sponsor_relationship, targeted_class
        ) VALUES (
            :gender, :first_name, :last_name, :other_name, :dob,
            :contact_phone, :home_address, :state, :nationality,
            :sponsor_name, :sponsor_phone, :sponsor_relationship, :targeted_class
        )
    ");

    $stmt->execute([
        ":gender" => $input["gender"],
        ":first_name" => $input["first_name"],
        ":last_name" => $input["last_name"],
        ":other_name" => $input["other_name"] ?? null,
        ":dob" => $input["dob"],
        ":contact_phone" => $input["contact_phone"],
        ":home_address" => $input["home_address"],
        ":state" => $input["state"],
        ":nationality" => $input["nationality"],
        ":sponsor_name" => $input["sponsor_name"],
        ":sponsor_phone" => $input["sponsor_phone"],
        ":sponsor_relationship" => $input["sponsor_relationship"],
        ":targeted_class" => $input["targeted_class"]
    ]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}