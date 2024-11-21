<?php

require '../config/connection.php';
require '../config/auth.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') { 
    try {
        if (!isset($userId)) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized user.']);
            exit();
        }

        $stmt = $pdo -> prepare (" SELECT c.title, i.created_at FROM invitations i join courses c on i.course_id = c.id WHERE i.student_id = :user_id");
        $stmt -> execute(['user_id' => $userId]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($result)) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User has no invitations']);
            exit();
        }

        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $result]);


    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
        exit();
    }
}else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit();
}
