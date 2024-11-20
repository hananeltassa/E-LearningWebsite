<?php
require '../config/connection.php';
require '../config/auth.php'; 


if ($role != 'student') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$student_id = $userId;  

$stmt = $pdo->prepare("
    SELECT c.id, c.title, c.description, u.username AS instructor_name, 
           IF(e.user_id IS NOT NULL, 1, 0) AS enrolled
    FROM courses c
    JOIN users u ON c.instructor_id = u.id
    LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = :student_id
    WHERE u.role = 'instructor'
");
$stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
$stmt->execute();
$courses = $stmt->fetchAll();


if ($courses) {
    echo json_encode(['status' => 'success', 'data' => $courses]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No courses found.']);
}
