<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // 1. Fetch all team members
        $stmt = $pdo->query("SELECT * FROM team ORDER BY display_order ASC, created_at DESC");
        if ($stmt) {
            $team = $stmt->fetchAll();
            echo json_encode($team);
        } else {
            echo json_encode([]);
        }
    } catch (Exception $e) {
        echo json_encode([]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Add new team member
    // Authentication check should go here

    $name = $_POST['name'] ?? '';
    $role = $_POST['role'] ?? '';
    $category = $_POST['category'] ?? 'Operational';
    $tags = $_POST['tags'] ?? ''; // Optional
    $bio = $_POST['bio'] ?? '';   // Optional
    $display_order = $_POST['display_order'] ?? 0;
    $imageUrl = '';

    // Handle Image Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/team/';
        if (!is_dir($uploadDir))
            mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '-' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imageUrl = '/uploads/team/' . $filename;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO team (name, role, category, tags, bio, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$name, $role, $category, $tags, $bio, $imageUrl, $display_order])) {
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
}
?>