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

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Koneksi gagal: " . $conn->connect_error]);
    exit();
}

$id_asdos = isset($_GET['id_asdos']) ? $conn->real_escape_string($_GET['id_asdos']) : null;

if (!$id_asdos) {
    echo json_encode(["success" => false, "error" => "id_asdos tidak ditemukan"]);
    exit();
}

// Ambil matkul yang diajar oleh asdos tertentu
$query = "SELECT m.id_matakuliah, m.nama_matakuliah 
          FROM hak_akses am
          JOIN matakuliah m ON am.id_matakuliah = m.id_matakuliah
          WHERE am.id_asdos = '$id_asdos'";

$result = $conn->query($query);
$matakuliah = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $matakuliah[] = $row;
    }
}

echo json_encode(["success" => true, "matakuliah" => $matakuliah]);
