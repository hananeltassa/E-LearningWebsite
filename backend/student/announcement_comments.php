<?php
require '../config/connection.php';
require '../config/auth.php';

if (!isset($userId)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized user.']);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $announcementId = $_GET['announcement_id'] ?? null;

    if (!$announcementId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Announcement ID is required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT ac.id, ac.comment_text, ac.created_at, u.username AS commenter_name
                               FROM announcement_comments ac
                               JOIN users u ON ac.user_id = u.id
                               WHERE ac.announcement_id = :announcement_id
                               ORDER BY ac.created_at DESC");
        $stmt->execute(['announcement_id' => $announcementId]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(['status' => 'success', 'comments' => $comments]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $announcementId = $data['announcement_id'] ?? null;
    $commentText = $data['comment_text'] ?? null;

    if (!$announcementId || !$commentText) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Announcement ID and comment text are required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO announcement_comments (announcement_id, user_id, comment_text)
                               VALUES (:announcement_id, :user_id, :comment_text)");
        $stmt->execute([
            'announcement_id' => $announcementId,
            'user_id' => $userId,
            'comment_text' => $commentText
        ]);

        http_response_code(201);
        echo json_encode(['status' => 'success', 'message' => 'Comment added successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
