<?php
require '../config/connection.php';
require 'auth.php'; 


if ($role !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE role IN ('student', 'instructor')");
$stmt->execute();
$users = $stmt->fetchAll();

$response = [
    'status' => 'success',
    'role' => $role
];

if ($users) {
    $response['data'] = $users;
} else {

    $response['status'] = 'error';
    $response['message'] = 'No users found.';
}

echo json_encode($response);
