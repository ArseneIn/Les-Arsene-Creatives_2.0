<?php
// ENABLE ERROR REPORTING
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// HANDLE PREFLIGHT REQUESTS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// Define upload directory using Absolute Path
$target_dir = __DIR__ . "/../uploads/";

// DIAGNOSTIC MODE: GET Request checks permissions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response = [
        "status" => "ready",
        "upload_dir" => $target_dir,
        "exists" => file_exists($target_dir),
        "writable" => is_writable($target_dir),
        "post_max_size" => ini_get('post_max_size'),
        "upload_max_filesize" => ini_get('upload_max_filesize')
    ];
    echo json_encode($response);
    exit;
}

// Create directory if it doesn't exist
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755, true); // try 0755 instead of 0777 first
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    // Sanitize filename: remove spaces and weird characters
    $safe_name = preg_replace('/[^a-zA-Z0-9._-]/', '', str_replace(' ', '_', basename($file["name"])));
    $fileName = time() . '_' . $safe_name; 
    $target_file = $target_dir . $fileName;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($file["tmp_name"]);
    if($check === false) {
        echo json_encode(["error" => "File is not an image."]);
        exit;
    }

    // Check file size (limit to 5MB)
    if ($file["size"] > 5000000) {
        echo json_encode(["error" => "Sorry, your file is too large."]);
        exit;
    }

    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" && $imageFileType != "webp" ) {
        echo json_encode(["error" => "Sorry, only JPG, JPEG, PNG, WEBP & GIF files are allowed."]);
        exit;
    }

    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Return URL relative to the domain root
        // If api is at /api/, and uploads is at /uploads/, then url is "/uploads/filename"
        echo json_encode([
            "success" => true, 
            "url" => "/uploads/" . $fileName, 
            "filename" => $fileName
        ]);
    } else {
        $error = error_get_last();
        echo json_encode(["error" => "Sorry, there was an error uploading your file.", "debug" => $error]);
    }
} else {
    echo json_encode(["error" => "No file sent or Method not POST."]);
}
?>
