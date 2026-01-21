<?php
require 'db.php';

$sqlFile = '../../database_setup.sql';

if (!file_exists($sqlFile)) {
    die(json_encode(['error' => 'SQL file not found']));
}

$sql = file_get_contents($sqlFile);

try {
    $pdo->exec($sql);
    echo json_encode(['success' => true, 'message' => 'Database tables created/updated successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>