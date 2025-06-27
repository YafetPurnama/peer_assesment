<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Tangani preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

// Ambil input JSON
$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$nama = $input['nama_matakuliah'] ?? null;

if ($id && $nama) {
    $stmt = $koneksi->prepare("UPDATE matakuliah SET nama_matakuliah=? WHERE id_matakuliah=?");
    $stmt->bind_param("si", $nama, $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gagal update"]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap"]);
}
