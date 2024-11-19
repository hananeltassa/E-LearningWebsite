<?php
require '../config/connection.php';
require 'auth.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id']) || !isset($data['ban'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$userId = $data['id'];
$banStatus = filter_var($data['ban'], FILTER_VALIDATE_BOOLEAN);  


$sql = "UPDATE users SET ban = :banStatus WHERE id = :id";
$stmt = $pdo->prepare($sql);


if ($stmt->execute([':banStatus' => $banStatus, ':id' => $userId])) {
    echo json_encode(['status' => 'success', 'message' => 'User ban status updated']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update user']);
}
?>
