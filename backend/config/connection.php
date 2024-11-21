<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// JWT configuration
require '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$secretKey = $_ENV['JWT_SECRET_KEY']; 

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