<?php
require '../config/connection.php';
require '../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    try {
        // Fetch the courses the user is enrolled in
        $stmt = $pdo->prepare("
            SELECT c.id AS course_id, c.title AS course_name 
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = :user_id
        ");
        $stmt->execute(['user_id' => $userId]);
        $enrolledCourses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($enrolledCourses)) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User is not enrolled in any courses']);
            exit();
        }

        // Collect the course IDs into an array
        $courseIds = array_column($enrolledCourses, 'course_id');

        // Retrieve the announcements for these courses
        $placeholders = rtrim(str_repeat('?, ', count($courseIds)), ', ');
        $stmt = $pdo->prepare("
            SELECT a.id, a.course_id, a.announcement_text, a.created_at, a.updated_at, c.title AS course_name
            FROM announcement a
            JOIN courses c ON a.course_id = c.id
            WHERE a.course_id IN ($placeholders)
            ORDER BY a.created_at DESC
        ");
        $stmt->execute($courseIds);

        $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the announcements as JSON
        if ($announcements) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'announcements' => $announcements]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No announcements found for the enrolled courses']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
