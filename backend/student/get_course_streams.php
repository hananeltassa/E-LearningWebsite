<?php
require '../config/connection.php';
require '../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    try {
        //Fetch the courses the user is enrolled in
        $stmt = $pdo->prepare("SELECT course_id FROM enrollments WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $enrolledCourses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($enrolledCourses)) {
            echo json_encode(['status' => 'error', 'message' => 'User is not enrolled in any courses']);
            exit();
        }

        //Collect the course IDs into an array
        $courseIds = array_map(function ($course) {
            return $course['course_id'];
        }, $enrolledCourses);

        //Retrieve the announcements for these courses
        $placeholders = rtrim(str_repeat('?, ', count($courseIds)), ', ');
        $stmt = $pdo->prepare("SELECT id, course_id, announcement_text, created_at, updated_at FROM announcement WHERE course_id IN ($placeholders) ORDER BY created_at DESC");
        $stmt->execute($courseIds);

        $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //Return the announcements as JSON
        if ($announcements) {
            echo json_encode(['status' => 'success', 'announcements' => $announcements]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No announcements found for the enrolled courses']);
        }

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
