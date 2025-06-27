<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // <== WAJIB agar tidak lanjut ke bawah
}
// Koneksi ke database
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

// Cek koneksi
if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Koneksi gagal"]);
    exit;
}

// Ambil data POST
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID tidak ditemukan"]);
    exit;
}

// Query hapus
$stmt = $koneksi->prepare("DELETE FROM matakuliah WHERE id_matakuliah = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Data berhasil dihapus"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal menghapus data"]);
}

$stmt->close();
$koneksi->close();
