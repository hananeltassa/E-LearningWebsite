<?php
require '../config/connection.php';
require '../config/auth.php';

$data = json_decode(file_get_contents('php://input'), true);

$student_id = $data['student_id'] ?? null;
$course_id = $data['course_id'] ?? null;
$instructor_id = $userId;

if (!$student_id || !$course_id) {
    echo json_encode(['status' => 'error', 'message' => 'Student ID and Course ID and Instructors ID are required']);
    exit;
}

$checkQuery = "SELECT * FROM invitations WHERE student_id = :student_id AND course_id = :course_id AND instructor_id = :instructor_id ";
$checkStmt = $pdo->prepare($checkQuery);

try {
    $checkStmt->execute(['student_id' => $student_id, 'course_id' => $course_id , 'instructor_id' => $instructor_id]);
    if ($checkStmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invitation already exists']);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error checking existing invitations: ' . $e->getMessage()]);
    exit;
}

$insertQuery = "INSERT INTO invitations (student_id, course_id, instructor_id) VALUES (:student_id, :course_id, :instructor_id)";
$stmt = $pdo->prepare($insertQuery);


try {
    $stmt->execute(['student_id' => $student_id, 'course_id' => $course_id, 'instructor_id' => $instructor_id]);
    echo json_encode(['status' => 'success', 'message' => 'Invitation sent successfully']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error sending invitation: ' . $e->getMessage()]);
}
?>
