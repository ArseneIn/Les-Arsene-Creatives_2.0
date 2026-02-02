<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->password)) {
    $username = $conn->real_escape_string($data->username);
    $password = $data->password;

    $sql = "SELECT id, username, password_hash FROM cms_users WHERE username = '$username' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password_hash'])) {
            // Success
            // Generate a simple token (in a real app, use JWT)
            $token = bin2hex(random_bytes(16));
            
            // Optionally store session or update last_login here
            
            echo json_encode([
                "status" => "success", 
                "token" => $token,
                "message" => "Login successful"
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
}

$conn->close();
?>
