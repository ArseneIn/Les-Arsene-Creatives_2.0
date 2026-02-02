<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$username = "ylgigsmy_admin"; 
$password = "Lesarsene@26";    
$dbname = "ylgigsmy_lesarsene";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>
