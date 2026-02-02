<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->old_password) && isset($data->new_password)) {
    $username = $conn->real_escape_string($data->username);
    $old_password = $data->old_password;
    $new_password = $data->new_password;

    // 1. Verify Old Password
    $sql = "SELECT id, password_hash FROM cms_users WHERE username = '$username' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($old_password, $row['password_hash'])) {
            // 2. Update to New Password
            $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $update_sql = "UPDATE cms_users SET password_hash = '$new_hash' WHERE id = " . $row['id'];
            
            if ($conn->query($update_sql) === TRUE) {
                echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Database update failed"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Incorrect old password"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing data"]);
}

$conn->close();
?>
