<?php
require '../config/connection.php';
require 'auth.php';

if ($role !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$stmt = $pdo->prepare("SELECT id, title, description, instructor_id FROM courses");
$stmt->execute();
$courses = $stmt->fetchAll();

if ($courses) {
    echo json_encode(['status' => 'success', 'data' => $courses]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No courses found.']);
}
