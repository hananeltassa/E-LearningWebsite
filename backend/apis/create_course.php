<?php
require '../config/connection.php';
require 'auth.php'; 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($role !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['title']) || empty($data['description']) || empty($data['instructor_name'])) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    $title = $data['title'];
    $description = $data['description'];
    $instructor_name = $data['instructor_name']; 

    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :instructor_name AND role = 'instructor'");
        $stmt->execute(['instructor_name' => $instructor_name]);

        if ($stmt->rowCount() > 0) {
            $instructor = $stmt->fetch(PDO::FETCH_ASSOC);
            $instructor_id = $instructor['id'];

            $stmt = $pdo->prepare("INSERT INTO courses (title, description, instructor_id) VALUES (:title, :description, :instructor_id)");
            $stmt->execute([
                'title' => $title,
                'description' => $description,
                'instructor_id' => $instructor_id
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Course created successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Instructor not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
