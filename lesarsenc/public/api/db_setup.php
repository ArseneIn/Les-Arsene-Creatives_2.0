<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';

header("Content-Type: text/html");

echo "<h1>Database Setup & Check</h1>";

// 1. Check Connection
if ($conn->connect_error) {
    die("<p style='color:red'>Connection Failed: " . $conn->connect_error . "</p>");
}
echo "<p style='color:green'>Database Connection: OK</p>";

// 2. Check/Create Tables
$table_sql = "CREATE TABLE IF NOT EXISTS cms_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) UNIQUE,
    value LONGTEXT
)";

if ($conn->query($table_sql) === TRUE) {
    echo "<p style='color:green'>Table 'cms_content': Checked/Created Successfully</p>";
} else {
    echo "<p style='color:red'>Error creating table 'cms_content': " . $conn->error . "</p>";
}

$users_table_sql = "CREATE TABLE IF NOT EXISTS cms_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($users_table_sql) === TRUE) {
    echo "<p style='color:green'>Table 'cms_users': Checked/Created Successfully</p>";
    
    // Seed Default Admin User if empty
    $check_user = $conn->query("SELECT * FROM cms_users WHERE username='admin'");
    if ($check_user->num_rows == 0) {
        // Default Password: "ChangeMe!123" -> You should change this immediately
        $default_pass = password_hash("ChangeMe!123", PASSWORD_DEFAULT);
        $insert_user = "INSERT INTO cms_users (username, password_hash) VALUES ('admin', '$default_pass')";
        
        if ($conn->query($insert_user) === TRUE) {
             echo "<p style='color:blue'>Seeded default user 'admin' with password 'ChangeMe!123'</p>";
        } else {
             echo "<p style='color:red'>Error seeding user: " . $conn->error . "</p>";
        }
    }
} else {
    echo "<p style='color:red'>Error creating table 'cms_users': " . $conn->error . "</p>";
}

$messages_table_sql = "CREATE TABLE IF NOT EXISTS cms_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    company VARCHAR(100),
    email VARCHAR(100),
    budget VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($messages_table_sql) === TRUE) {
    echo "<p style='color:green'>Table 'cms_messages': Checked/Created Successfully</p>";
} else {
    echo "<p style='color:red'>Error creating table 'cms_messages': " . $conn->error . "</p>";
}

// 3. Check Table Content
$result = $conn->query("SELECT * FROM cms_content");
if ($result) {
    echo "<p>Rows in table: " . $result->num_rows . "</p>";
    if ($result->num_rows > 0) {
        echo "<ul>";
        while($row = $result->fetch_assoc()) {
            echo "<li><strong>" . $row['key_name'] . "</strong> (" . strlen($row['value']) . " chars)</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color:orange'>Table is empty. Use the Admin Panel to add content.</p>";
    }
} else {
    echo "<p style='color:red'>Error reading table: " . $conn->error . "</p>";
}

$conn->close();
?>
