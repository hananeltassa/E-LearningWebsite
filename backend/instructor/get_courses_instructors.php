<?php

require '../config/connection.php';
require '../config/auth.php'; 


if ($role !== 'instructor') {
    http_response_code(403); // Forbidden
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

if (isset($userId)) {

    $query = 'SELECT id, title, description, instructor_id, created_at FROM courses WHERE instructor_id = :instructor_id';

    try {
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':instructor_id', $userId, PDO::PARAM_INT); 
        $stmt->execute();
        $courses = $stmt->fetchAll();

        if ($courses) {
            echo json_encode(['status' => 'success', 'courses' => $courses]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No courses found for this instructor.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database query failed: ' . $e->getMessage()]);
    }
} else {

    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access.']);
}
?>
