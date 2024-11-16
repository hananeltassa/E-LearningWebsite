<?php
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
    // Create a PDO instance for database connection
    $pdo = new PDO($dsn, $dbuser, $pass, $options);
} catch (\PDOException $e) {
    // Handle errors
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
