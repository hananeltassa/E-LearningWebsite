<?php

require '../config/connection.php';

require '../vendor/autoload.php'; //to manage php dependencies 
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$email = $data->email ?? '';
$password = $data->password ?? '';
$role = $data->role ?? 'student';

if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT); 

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword, $role]);
    echo json_encode(['status' => 'success', 'message' => 'User registered successfully.']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
