<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // <== WAJIB agar tidak lanjut ke bawah
}

session_start();


// Koneksi DB
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");


$sql = "SELECT m.*, u.username, u.email, u.role
        FROM asdos m
        JOIN users u ON m.id_user = u.id";
$result = $koneksi->query($sql);

$data = [];

$data = [];
while ($row = $result->fetch_assoc()) {
    $sql1 = "SELECT *
        FROM hak_akses join matakuliah on hak_akses.id_matakuliah = matakuliah.id_matakuliah where hak_akses.id_asdos = '".$row['id_user']."'";
    $result1 = $koneksi->query($sql1);
    print_r($koneksi->error);
    $penilaian = array();
    while ($row1 = $result1->fetch_assoc()) {
        $penilaian[] = $row1;
    }
    $row['matkul'] = $penilaian;
    $data[] = $row;
}

echo json_encode(["success" => true, "asdos" => $data]);
