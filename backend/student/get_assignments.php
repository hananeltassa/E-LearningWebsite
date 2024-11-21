<?php
require '../config/connection.php';
require '../config/auth.php';

if ($role != 'student') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$student_id = $userId; 

$stmt = $pdo->prepare("
    SELECT a.id, a.title, a.description, a.due_date, a.posted_at, c.title AS course_name
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    WHERE c.id IN (SELECT course_id FROM enrollments WHERE user_id  = :student_id)
");

$stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
$stmt->execute();
$assignments = $stmt->fetchAll();

if ($assignments) {
    echo json_encode(['status' => 'success', 'data' => $assignments]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No assignments found.']);
}
?>
