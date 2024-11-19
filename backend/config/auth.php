<?php
require '../config/connection.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$jwt = null;

if ($authHeader) {
    $matches = [];
    preg_match('/Bearer (.+)/', $authHeader, $matches);
    if (count($matches) > 1) {
        $jwt = $matches[1];
    }
}

if (!$jwt) {
    echo json_encode(['status' => 'error', 'message' => 'Token missing.']);
    exit();
}

try {
    $key = new Key($secretKey, 'HS256');
    $decoded = JWT::decode($jwt, $key);
    $userId = $decoded->data->id;
    $role = $decoded->data->role;
    //echo json_encode(['status' => 'success', 'role' => $role]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Token is invalid: ' . $e->getMessage()]);
    exit();
}