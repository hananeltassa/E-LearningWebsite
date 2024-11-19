<?php
require '../config/connection.php';
require '../config/auth.php';


$sql = "SELECT * FROM users WHERE role = 'student'"; 
$stmt = $pdo->prepare($sql);

try {
    $stmt->execute(); 
    $students = $stmt->fetchAll(); 
    
    if (count($students) > 0) {
        echo json_encode(['status' => 'success', 'students' => $students]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No students found']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
