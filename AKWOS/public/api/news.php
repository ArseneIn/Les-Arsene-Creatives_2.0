<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Fetch all news
    $stmt = $pdo->query("SELECT * FROM news ORDER BY date DESC");
    $news = $stmt->fetchAll();
    echo json_encode($news);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Create new news article
    // Note: Add authentication check here in production

    $title = $_POST['title'] ?? '';
    $date = $_POST['date'] ?? date('Y-m-d');
    $category = $_POST['category'] ?? 'General';
    $tag = $_POST['tag'] ?? 'News';
    $description = $_POST['description'] ?? '';
    $imageUrl = '';

    // Handle Image Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/news/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $filename = uniqid() . '-' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $filename;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imageUrl = '/uploads/news/' . $filename; // Store relative path for frontend
        }
    } else {
        // Fallback or use provided URL string if implemented
        $imageUrl = $_POST['image_url'] ?? ''; 
    }

    $stmt = $pdo->prepare("INSERT INTO news (title, date, category, image_url, tag, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $date, $category, $imageUrl, $tag, $description]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
?>
