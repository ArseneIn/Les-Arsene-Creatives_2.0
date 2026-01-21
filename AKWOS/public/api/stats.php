<?php
require_once 'db.php';

try {
    $stats = [];

    // Helper to count safely
    function getCount($pdo, $table)
    {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
            if ($stmt) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return $row ? $row['count'] : 0;
            }
        } catch (Exception $e) {
            return 0;
        }
        return 0;
    }

    $stats['news'] = getCount($pdo, 'news');
    $stats['resources'] = getCount($pdo, 'resources');
    $stats['partners'] = getCount($pdo, 'partners');

    // Mock values for now
    $stats['pending_reviews'] = 0;
    $stats['total_downloads'] = "2.4k";

    echo json_encode($stats);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>