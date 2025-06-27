<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");
if ($koneksi->connect_error) {
    echo json_encode(["success" => false, "error" => "Koneksi gagal: " . $koneksi->connect_error]);
    exit();
}

$idKelompok = isset($_GET['id_pengelompokan']) ? intval($_GET['id_pengelompokan']) : null;

// Ambil mahasiswa yang tidak ada di penilaian sama sekali
// atau hanya ada di penilaian dari kelompok yang sama
$sql = "
    SELECT m.*, u.username, u.email, u.role
    FROM mahasiswa m
    JOIN users u ON m.id_user = u.id
    WHERE NOT EXISTS (
        SELECT 1
        FROM penilaian p
        JOIN pengelompokan g ON g.id_pengelompokan = p.id_pengelompokan
        WHERE p.id_user = u.id
        " . ($idKelompok ? "AND g.id_pengelompokan <> ?" : "") . "
    )
";

$stmt = $koneksi->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Prepare failed: " . $koneksi->error]);
    exit();
}

// Bind jika id_kelompok dikirim
if ($idKelompok) {
    $stmt->bind_param("i", $idKelompok);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "mahasiswa" => $data]);
