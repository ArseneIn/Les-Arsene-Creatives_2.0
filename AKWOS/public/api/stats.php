<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

try {
    $stats = [];

    // Count News
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM news");
    $stats['news'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Count Resources
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM resources");
    $stats['resources'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Count Partners
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM partners");
    $stats['partners'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Mock values for now
    $stats['pending_reviews'] = 0;
    $stats['total_downloads'] = "2.4k"; // Placeholder until we track downloads

    echo json_encode($stats);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>