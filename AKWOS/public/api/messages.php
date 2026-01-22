<?php
require_once 'db.php';

header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        if (isset($_GET['count_unread'])) {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM messages WHERE is_read = 0");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['count' => $result['count']]);
        } else {
            $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($messages);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Handle Delete or Mark as Read
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? '';
    $id = $data['id'] ?? 0;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    try {
        if ($action === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Message deleted']);
        } elseif ($action === 'mark_read') {
            $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Message marked as read']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
