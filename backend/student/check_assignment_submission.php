<?php
require '../config/connection.php';  
require '../config/auth.php'; 

if (!isset($userId)) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
    exit;
}

$assignment_id = isset($_GET['assignment_id']) ? intval($_GET['assignment_id']) : 0;

if ($assignment_id === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid assignment ID']);
    exit;
}

try {

    $stmt = $pdo->prepare("SELECT id FROM assignments_submissions WHERE user_id = ? AND assignment_id = ?");
    
    $stmt->execute([$userId, $assignment_id]);

    $submission = $stmt->fetch();

    if ($submission) {
        echo json_encode(['status' => 'success', 'submitted' => true]);
    } else {
        echo json_encode(['status' => 'success', 'submitted' => false]);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error checking assignment submission: ' . $e->getMessage()]);
}
?>
