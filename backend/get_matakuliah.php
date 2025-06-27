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


$query = $koneksi->prepare("SELECT * FROM matakuliah");
$query->execute();
$result = $query->get_result();
$data = array();
while ($d = $result->fetch_assoc()) {
    $data[] = $d;
}
echo json_encode(["success" => true, "matakuliah" => $data]);
