<?php
require '../config/connection.php';
require '../config/auth.php'; 

if ($role !== 'admin' && $role != 'student') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$stmt = $pdo->prepare("SELECT c.id, c.title, c.description, u.username AS instructor_name
                       FROM courses c
                       JOIN users u ON c.instructor_id = u.id
                       WHERE u.role = 'instructor'"); 
$stmt->execute();
$courses = $stmt->fetchAll();

if ($courses) {
    echo json_encode(['status' => 'success', 'data' => $courses]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No courses found.']);
}

