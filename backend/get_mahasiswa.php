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
        FROM mahasiswa m
        JOIN users u ON m.id_user = u.id";
$result = $koneksi->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "mahasiswa" => $data]);
