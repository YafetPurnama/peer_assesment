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
// $koneksi = new mysqli("localhost", "root", "", "db_peer_eval");
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");
if ($koneksi->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Gagal terkoneksi: " . $koneksi->connect_error]);
    exit();
}

$counts = [
    "mahasiswa"      => 0,
    "matakuliah"     => 0,
    "pengelompokan"  => 0,
];

// $matakuliah = $koneksi->query("SELECT count(*) as matakuliah FROM matakuliah")->fetch_assoc()['matakuliah'];
// $mahasiswa = $koneksi->query("SELECT count(*) as mahasiswa FROM matakuliah")->fetch_assoc()['mahasiswa'];
// $pengelompokan = $koneksi->query("SELECT count(*) as pengelompokan FROM matakuliah")->fetch_assoc()['pengelompokan'];

// echo json_encode(["mahasiswa" => $mahasiswa, "matakuliah" => $matakuliah, "pengelompokan" => $pengelompokan]);
$queryMap = [
    "mahasiswa"     => "SELECT COUNT(*) AS total FROM mahasiswa",
    "matakuliah"    => "SELECT COUNT(*) AS total FROM matakuliah",
    "pengelompokan" => "SELECT COUNT(*) AS total FROM pengelompokan"
];

foreach ($queryMap as $key => $sql) {
    $result = $koneksi->query($sql);
    if ($result) {
        $counts[$key] = (int)$result->fetch_assoc()['total'];
        $result->free();
    }
}

echo json_encode($counts, JSON_UNESCAPED_UNICODE);
