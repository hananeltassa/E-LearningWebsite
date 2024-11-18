<?php
require '../config/connection.php';
require 'auth.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if ($role !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Course ID is required']);
        exit;
    }

    $id = $data['id'];

    $query = "DELETE FROM courses WHERE id='$id'";
    if (mysqli_query($conn, $query)) {
        echo json_encode(['status' => 'success', 'message' => 'Course deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete course']);
    }
}
?>
