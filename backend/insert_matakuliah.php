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

// Koneksi ke database
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

// Cek koneksi
if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal: " . $koneksi->connect_error]);
    exit();
}

// Ambil input JSON
$input = json_decode(file_get_contents("php://input"), true);
$nama = $input['nama_matakuliah'] ?? null;

if ($nama) {
    // Perbaikan query SQL
    $stmt = $koneksi->prepare("INSERT INTO matakuliah (nama_matakuliah) VALUES (?)");
    $stmt->bind_param("s", $nama);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gagal menambahkan data: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap"]);
}

$koneksi->close();
