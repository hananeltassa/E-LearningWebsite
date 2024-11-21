<?php
require '../config/connection.php';
require '../config/auth.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($role !== 'student') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);


    if (!isset($data['course_id']) || !isset($data['enroll'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        exit;
    }

    $courseId = $data['course_id'];
    $enrollStatus = filter_var($data['enroll'], FILTER_VALIDATE_BOOLEAN);

    try {
        if ($enrollStatus) {
            // Enroll the student
            $stmt = $pdo->prepare("SELECT * FROM enrollments WHERE user_id = :user_id AND course_id = :course_id");
            $stmt->execute(['user_id' => $userId, 'course_id' => $courseId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'error', 'message' => 'Already enrolled']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (:user_id, :course_id, NOW())");
            $stmt->execute(['user_id' => $userId, 'course_id' => $courseId]);

            echo json_encode(['status' => 'success', 'message' => 'Enrolled successfully']);
        } else {
            // Unenroll the student
            $stmt = $pdo->prepare("DELETE FROM enrollments WHERE user_id = :user_id AND course_id = :course_id");
            $stmt->execute(['user_id' => $userId, 'course_id' => $courseId]);

            echo json_encode(['status' => 'success', 'message' => 'Unenrolled successfully']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
