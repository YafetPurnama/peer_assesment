<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Tangani preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "db_peer_eval");
$data = json_decode(file_get_contents("php://input"), true);

$id_pengelompokan = $conn->real_escape_string($data['id_pengelompokan']);
$id_user = $conn->real_escape_string($data['id_user']);
$query = "INSERT INTO penilaian (id_pengelompokan, id_user) 
    VALUES ('$id_pengelompokan', '$id_user')";
if ($conn->query($query)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Gagal insert pengelompokan: " . $conn->error]);
}
?>
