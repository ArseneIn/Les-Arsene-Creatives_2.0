<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Fetch all resources
    $stmt = $pdo->query("SELECT * FROM resources ORDER BY created_at DESC");
    $resources = $stmt->fetchAll();
    echo json_encode($resources);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Upload new resource
    // Note: Add authentication check here in production

    $title = $_POST['title'] ?? '';
    $year = $_POST['year'] ?? date('Y');
    $type = $_POST['type'] ?? 'Other';
    $description = $_POST['description'] ?? '';
    // Auto-migrate: Add description column if missing
    try {
        $pdo->query("SELECT description FROM resources LIMIT 1");
    } catch (Exception $e) {
        $pdo->query("ALTER TABLE resources ADD COLUMN description TEXT");
    }

    $fileUrl = '';
    $size = '';

    // Handle File Upload
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/resources/';
        if (!is_dir($uploadDir))
            mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '-' . basename($_FILES['file']['name']);
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
            $fileUrl = '/uploads/resources/' . $filename;

            // Calculate size (e.g., "2.5 MB")
            $bytes = filesize($targetPath);
            if ($bytes >= 1048576) {
                $size = number_format($bytes / 1048576, 1) . ' MB';
            } elseif ($bytes >= 1024) {
                $size = number_format($bytes / 1024, 0) . ' KB';
            } else {
                $size = $bytes . ' B';
            }
        }
    }

    if (!$fileUrl) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO resources (title, year, type, size, file_url, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $year, $type, $size, $fileUrl, $description]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // 3. Delete resource
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM resources WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>