<?php
require '../config/connection.php';
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$role) {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    $query = "SELECT * FROM courses";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $courses = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $courses[] = $row;
        }
        echo json_encode(['status' => 'success', 'courses' => $courses]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch courses']);
    }
}
?>
