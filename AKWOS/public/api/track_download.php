<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;

    if ($id > 0) {
        try {
            // Increment download count safely
            $stmt = $pdo->prepare("UPDATE resources SET download_count = download_count + 1 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            // Silently fail or log error
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid ID']);
    }
}
?>