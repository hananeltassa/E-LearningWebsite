<?php
require '../config/connection.php';
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if ($role !== 'admin') {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id']) || empty($data['title']) || empty($data['description'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    try {
        $query = "UPDATE courses SET title = :title, description = :description WHERE id = :id";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
        $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
        $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Course updated successfully']);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['status' => 'error', 'message' => 'Failed to update course']);
        }
    } catch (PDOException $e) {
        http_response_code(500); 
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>