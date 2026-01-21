<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Auto-migrate: Add display_order column if missing
    try {
        $pdo->query("SELECT display_order FROM team LIMIT 1");
    } catch (Exception $e) {
        $pdo->query("ALTER TABLE team ADD COLUMN display_order INT DEFAULT 0");
    }

    try {
        // 1. Fetch all team members
        $stmt = $pdo->query("SELECT * FROM team ORDER BY display_order ASC, id ASC");
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
    // Check for reorder action
    if (isset($_POST['action']) && $_POST['action'] === 'reorder') {
        $orderedIds = $_POST['orderedIds'] ?? [];
        if (!is_array($orderedIds)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data format']);
            exit;
        }

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE team SET display_order = ? WHERE id = ?");
            foreach ($orderedIds as $index => $id) {
                $stmt->execute([$index, $id]);
            }
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        exit;
    }

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
        $uploadDir = __DIR__ . '/../../public/uploads/team/';
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

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // 3. Delete team member
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM team WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>