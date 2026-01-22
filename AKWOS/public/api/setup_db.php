<?php
require_once 'db.php';

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        organization VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        inquiry_type VARCHAR(100),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";

    $pdo->exec($sql);
    echo "Table 'messages' created or already exists successfully.";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>