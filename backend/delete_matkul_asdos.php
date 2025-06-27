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

$id_asdos = $conn->real_escape_string($data['id_asdos']);
$id_matakuliah = $conn->real_escape_string($data['id_matakuliah']);

$query = "DELETE FROM hak_akses 
    WHERE id_asdos = '$id_asdos' AND id_matakuliah = '$id_matakuliah'";

if ($conn->query($query)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Gagal hapus relasi: " . $conn->error]);
}
?>
