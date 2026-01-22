<?php
require_once 'db.php';

$username = 'admin';
$password = 'password123';
$hash = password_hash($password, PASSWORD_DEFAULT);
$email = 'admin@akwos.org';

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        // Update password
        $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE username = ?");
        $stmt->execute([$hash, $username]);
        echo "User 'admin' updated with password 'password123'.";
    } else {
        // Create user
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, 'admin')");
        $stmt->execute([$username, $hash, $email]);
        echo "User 'admin' created with password 'password123'.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
