<?php

require '../config/connection.php';
require '../config/auth.php';

if (!isset($userId)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized user.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['assignment_id']) && isset($_FILES['assignment_file'])) {

        $assignmentId = $_POST['assignment_id'];  
        $file = $_FILES['assignment_file'];  
        $userId = $userId; 

        // Check if the assignment exists and get the due date
        try {
            $stmt = $pdo->prepare("SELECT due_date FROM assignments WHERE id = :assignment_id");
            $stmt->execute([':assignment_id' => $assignmentId]);
            $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$assignment) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Assignment not found.']);
                exit();
            }

            $dueDate = $assignment['due_date'];

            // Check if the current date is past the due date
            if (strtotime($dueDate) < time()) {
                http_response_code(400);
                echo json_encode(['status' => 'denied', 'message' => 'The assignment submission deadline has passed.']);
                exit();
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            exit();
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'File upload error']);
            exit();
        }

        $uploadDir = 'uploads/assignments/';
        $fileName = time() . '-' . basename($file['name']); 
        $filePath = $uploadDir . $fileName; 

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if (move_uploaded_file($file['tmp_name'], $filePath)) {

            try {
                $stmt = $pdo->prepare("INSERT INTO assignments_submissions (assignment_id, user_id, file_path, submitted_at) 
                                       VALUES (:assignment_id, :user_id, :file_path, NOW())");
                
                $stmt->execute([
                    ':assignment_id' => $assignmentId,
                    ':user_id' => $userId,
                    ':file_path' => $filePath
                ]);

                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Assignment submitted successfully']);

            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            }

        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload file']);
        }

    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required data: assignment_id or assignment_file']);
    }

} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

?>
