<?php
require_once 'db.php';

header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    // Fallback to $_POST if not JSON
    $data = $_POST;
}

$name = $data['name'] ?? '';
$organization = $data['organization'] ?? '';
$email = $data['email'] ?? '';
$inquiry_type = $data['inquiry_type'] ?? 'General Inquiry';
$message = $data['message'] ?? '';

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and message are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO messages (name, organization, email, inquiry_type, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $organization, $email, $inquiry_type, $message]);

    // Optional: Send email notification (if server supports it)
    // mail("info@akwos.org", "New Contact Form: $inquiry_type", "From: $name ($email)\n\n$message");

    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
