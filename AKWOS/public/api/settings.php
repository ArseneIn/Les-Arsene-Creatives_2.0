<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (
        !isset($data->username) ||
        !isset($data->current_password) ||
        !isset($data->new_password)
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete data"]);
        exit;
    }

    $username = $data->username;
    $current_password = $data->current_password;
    $new_password = $data->new_password;

    try {
        // 1. Verify current credential
        $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($current_password, $user['password_hash'])) {
            // 2. Update to new password
            $new_hash = password_hash($new_password, PASSWORD_DEFAULT);

            $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            if ($updateStmt->execute([$new_hash, $user['id']])) {
                echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update password"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Incorrect current password"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>