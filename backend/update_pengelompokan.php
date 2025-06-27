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

// Koneksi ke database
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

// Ambil data JSON
$data = json_decode(file_get_contents("php://input"), true);

$id_pengelompokan = $data['id_pengelompokan'] ?? '';
$nama_pengelompokan = $data['nama_pengelompokan'] ?? '';
$id_matakuliah = $koneksi->real_escape_string($data['id_matakuliah']);

// Validasi input
if ($id_pengelompokan && $nama_pengelompokan && $id_matakuliah) {
    // Update tabel pengelompokan
    $stmt = $koneksi->prepare("UPDATE pengelompokan SET nama_pengelompokan=?, id_matakuliah=? WHERE id_pengelompokan=?");
    $stmt->bind_param("sii", $nama_pengelompokan, $id_matakuliah, $id_pengelompokan);
    $success = $stmt->execute();
    echo json_encode(["success" => $success]);
} else {
    echo json_encode(["success" => false, "error" => "Semua field wajib diisi."]);
}
