<?php

require '../config/connection.php';
require '../config/auth.php'; 

if ($role !== 'instructor') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$announcement = $data['announcement'] ?? '';
$course_id = $data['course_id'] ?? '';

if (empty($announcement) || empty($course_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Announcement and course_id are required']);
    exit();
}

$sql = "INSERT INTO announcement (course_id, announcement_text) VALUES (?, ?)";

$stmt = $pdo->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare SQL statement']);
    exit();
}

$stmt->bindParam(1, $course_id, PDO::PARAM_INT);
$stmt->bindParam(2, $announcement, PDO::PARAM_STR);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Announcement posted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to post announcement']);
}

$stmt->closeCursor();
$pdo = null;
?>
