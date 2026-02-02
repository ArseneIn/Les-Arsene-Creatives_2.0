<?php
ob_start();
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle GET (Fetch Content)
if ($method === 'GET') {
    ob_clean(); // Clean any previous output (newlines, etc)
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    header("Content-Type: application/json");
    
    $sql = "SELECT * FROM cms_content";
    $result = $conn->query($sql);
    $content = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $content[$row['key_name']] = $row['value'];
        }
    }
    echo json_encode($content);
}

// Handle POST (Update Content)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->key) && isset($data->value)) {
        $key = $data->key;
        $value = $data->value;
        
        $sql = "INSERT INTO cms_content (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $key, $value, $value);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Content saved successfully."]);
        } else {
            $error = $stmt->error;
            error_log("Database Save Error: " . $error);
            echo json_encode(["success" => false, "message" => "Error saving content: " . $error]);
        }
        $stmt->close();
    }
}

$conn->close();
?>
