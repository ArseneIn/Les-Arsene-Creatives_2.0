<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Auto-migrate: Add display_order column if missing
    try {
        $pdo->query("SELECT display_order FROM partners LIMIT 1");
    } catch (Exception $e) {
        $pdo->query("ALTER TABLE partners ADD COLUMN display_order INT DEFAULT 0");
    }

    // 1. Fetch all partners
    $stmt = $pdo->query("SELECT * FROM partners ORDER BY display_order ASC, id ASC");
    $partners = $stmt->fetchAll();
    echo json_encode($partners);

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
            $stmt = $pdo->prepare("UPDATE partners SET display_order = ? WHERE id = ?");
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

    // 2. Create new partner

    $name = $_POST['name'] ?? '';
    $websiteUrl = $_POST['website_url'] ?? '';
    $logoUrl = '';

    // Handle Logo Upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../../public/uploads/partners/';
        if (!is_dir($uploadDir))
            mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '-' . basename($_FILES['logo']['name']);
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['logo']['tmp_name'], $targetPath)) {
            $logoUrl = '/uploads/partners/' . $filename;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO partners (name, logo_url, website_url, display_order) VALUES (?, ?, ?, 0)");
    $stmt->execute([$name, $logoUrl, $websiteUrl]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // 3. Delete partner
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM partners WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>