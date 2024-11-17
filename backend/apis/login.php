<?php

require '../config/connection.php';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $payload = [
            'iss' => 'http://localhost',
            'aud' => 'http://localhost',
            'iat' => time(),
            'exp' => time() + (60 * 60), 
            'data' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ];

        $jwt = JWT::encode($payload, $secretKey, 'HS256');

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $jwt,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>

