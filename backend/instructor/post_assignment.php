<?php

require '../config/connection.php';
require '../config/auth.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['title']) || empty($data['description']) || empty($data['due_date']) || empty($data['course_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Title, description, due_date, and course_id are required.']);
        exit();
    }

    $title = htmlspecialchars($data['title']);
    $description = htmlspecialchars($data['description']);
    $due_date = htmlspecialchars($data['due_date']);
    $course_id = (int) $data['course_id'];  

    try {
        $stmt = $pdo->prepare("INSERT INTO assignments (course_id, title, description, due_date) VALUES (:course_id, :title, :description, :due_date)");
        $stmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        $stmt->bindParam(':description', $description, PDO::PARAM_STR);
        $stmt->bindParam(':due_date', $due_date, PDO::PARAM_STR);

        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Assignment posted successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to post assignment: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
