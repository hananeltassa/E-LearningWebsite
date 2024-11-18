<?php
require '../config/connection.php';
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if ($role !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id']) || empty($data['title']) || empty($data['description'])) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    $id = $data['id'];
    $title = $data['title'];
    $description = $data['description'];

    $query = "UPDATE courses SET title='$title', description='$description' WHERE id='$id'";
    if (mysqli_query($conn, $query)) {
        echo json_encode(['status' => 'success', 'message' => 'Course updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update course']);
    }
}
?>
