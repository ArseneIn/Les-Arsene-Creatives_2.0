<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM impact_stories ORDER BY date DESC");
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($stories);
    } catch (PDOException $e) {
        // Return empty array if table doesn't exist yet
        echo json_encode([]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $date = $_POST['date'] ?? date('Y-m-d');
    $category = $_POST['category'] ?? 'General';
    $excerpt = $_POST['excerpt'] ?? '';
    $badge = $_POST['badge'] ?? '';

    $image_url = '';

    // Handle Image Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../public/uploads/stories/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $image_url = '/uploads/stories/' . $fileName;
        }
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO impact_stories (title, date, category, excerpt, badge, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $date, $category, $excerpt, $badge, $image_url]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // 3. Delete story
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM impact_stories WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>