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

$id_dosen = $data['id_dosen'] ?? '';
$nama_dosen = $data['nama_dosen'] ?? '';
$id_user = $data['id_user'] ?? ''; // ini bisa disesuaikan kalau id_user tetap
$no_telepon = $data['no_telepon'] ?? '';
$nip = $data['nip'] ?? '';
$password = $data['password'] ?? null; // opsional

// Validasi input
if ($id_dosen && $nama_dosen && $id_user && $no_telepon && $nip) {
    // Update tabel dosen
    $stmt = $koneksi->prepare("UPDATE dosen SET nama_dosen=?, id_user=?, no_telepon=?, nip=? WHERE id_dosen=?");
    $stmt->bind_param("sissi", $nama_dosen, $id_user, $no_telepon, $nip, $id_dosen);
    $success = $stmt->execute();

    // Update password jika dikirim
    if ($success && !empty($password)) {
        // Hash password dulu
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt2 = $koneksi->prepare("UPDATE users SET password=? WHERE id=?");
        $stmt2->bind_param("si", $hashed_password, $id_user);
        $stmt2->execute();
    }

    echo json_encode(["success" => $success]);
} else {
    echo json_encode(["success" => false, "error" => "Semua field wajib diisi."]);
}
