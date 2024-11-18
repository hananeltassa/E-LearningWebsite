<?php
require '../config/connection.php';
require 'auth.php';


if ($role !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Insufficient permissions.']);
    exit();
}

$stmt = $pdo->prepare("SELECT id, username, email, role FROM users WHERE role IN ('student', 'instructor')");
$stmt->execute();
$users = $stmt->fetchAll();

if ($users) {
    echo json_encode(['status' => 'success', 'data' => $users]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No users found.']);
}