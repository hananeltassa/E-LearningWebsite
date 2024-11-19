<?php
require '../config/connection.php'; 
require '../config/auth.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

if ($role !== 'admin') {
    http_response_code(403); // Forbidden
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);


$id = isset($data['id']) ? $data['id'] : null;

if (empty($id)) {
    http_response_code(400); 
    echo json_encode(['status' => 'error', 'message' => 'Course ID is required']);
    exit;
}

try {
    $query = $pdo->prepare("DELETE FROM courses WHERE id = :id");
    $query->bindParam(':id', $id, PDO::PARAM_INT);

    if ($query->execute()) {
        if ($query->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Course deleted successfully']);
        } else {
            http_response_code(404); 
            echo json_encode(['status' => 'error', 'message' => 'Course not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete course']);
    }
} catch (Exception $e) {
    http_response_code(500); 
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
