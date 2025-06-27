<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

// Cek koneksi
if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Koneksi database gagal: " . $koneksi->connect_error]);
    exit;
}

// Ambil data POST
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id_penilaian']) ? (int) $data['id_penilaian'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID penilaian tidak valid"]);
    exit;
}

// Query hapus
$stmt = $koneksi->prepare("DELETE FROM penilaian WHERE id_penilaian = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Penilaian berhasil dihapus"]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "ID penilaian tidak ditemukan"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal menghapus penilaian"]);
}

$stmt->close();
$koneksi->close();
