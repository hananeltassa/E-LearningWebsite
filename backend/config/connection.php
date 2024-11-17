<?php

header('Content-Type: application/json');


$host = "localhost"; 
$dbuser = "root";   
$pass = "";           
$dbname = 'elearning_platform'; 

$charset = 'utf8mb4';


$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $dbuser, $pass, $options);
    //echo json_encode(['status' => 'success', 'message' => 'Database connection successful']);
} catch (\PDOException $e) {
    //echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
