<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db_connect.php';

echo "Database connection successful!<br>";

$result = $conn->query("SHOW TABLES");
if ($result->num_rows > 0) {
    echo "Tables in database:<br>";
    while($row = $result->fetch_row()) {
        echo "- " . $row[0] . "<br>";
    }
} else {
    echo "Connected, but no tables found (Did you run the SQL to create the table?).";
}

$conn->close();
?>
