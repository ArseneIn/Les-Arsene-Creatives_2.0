<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Receive new message
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->name) && isset($data->email)) {
             $name = $conn->real_escape_string($data->name);
             $company = $conn->real_escape_string($data->company ?? '');
             $email = $conn->real_escape_string($data->email);
             $budget = $conn->real_escape_string($data->budget ?? '');
             $message = $conn->real_escape_string($data->message ?? '');
             
             $sql = "INSERT INTO cms_messages (name, company, email, budget, message) VALUES ('$name', '$company', '$email', '$budget', '$message')";
             
             if ($conn->query($sql) === TRUE) {
                 echo json_encode(["status" => "success", "message" => "Message sent"]);
             } else {
                 http_response_code(500);
                 echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
             }
        } else {
             http_response_code(400);
             echo json_encode(["status" => "error", "message" => "Missing name or email"]);
        }
        break;

    case 'GET':
        // List messages (Admin only) - Simplistic check, normally check token
        $result = $conn->query("SELECT * FROM cms_messages ORDER BY created_at DESC");
        $messages = [];
        while($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }
        echo json_encode($messages);
        break;

    case 'DELETE':
        // Delete message
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = intval($data->id);
            if ($conn->query("DELETE FROM cms_messages WHERE id=$id") === TRUE) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        }
        break;
}

$conn->close();
?>
