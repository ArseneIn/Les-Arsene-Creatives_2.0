<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Fetch all partners
    $stmt = $pdo->query("SELECT * FROM partners ORDER BY created_at DESC");
    $partners = $stmt->fetchAll();
    echo json_encode($partners);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Create new partner

    $name = $_POST['name'] ?? '';
    $websiteUrl = $_POST['website_url'] ?? '';
    $logoUrl = '';

    // Handle Logo Upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/partners/';
        if (!is_dir($uploadDir))
            mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '-' . basename($_FILES['logo']['name']);
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['logo']['tmp_name'], $targetPath)) {
            $logoUrl = '/uploads/partners/' . $filename;
        }
    }

    if (!$logoUrl) {
        // Optionally handle error if logo is mandatory
    }

    $stmt = $pdo->prepare("INSERT INTO partners (name, logo_url, website_url) VALUES (?, ?, ?)");
    $stmt->execute([$name, $logoUrl, $websiteUrl]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
?>