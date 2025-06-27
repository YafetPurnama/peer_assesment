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

$data = json_decode(file_get_contents("php://input"), true);
$id_asdos = $data['id_asdos'] ?? '';

if ($id_asdos) {
    // Ambil id_user terlebih dahulu
    $stmt = $koneksi->prepare("SELECT id_user FROM asdos WHERE id_asdos = ?");
    $stmt->bind_param("i", $id_asdos);
    $stmt->execute();
    $stmt->bind_result($id_user);
    $stmt->fetch();
    $stmt->close();

    if ($id_user) {
        // Hapus asdos
        $stmt = $koneksi->prepare("DELETE FROM asdos WHERE id_asdos = ?");
        $stmt->bind_param("i", $id_asdos);
        $successasdos = $stmt->execute();
        $stmt->close();

        // Hapus user
        $stmt = $koneksi->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id_user);
        $successUser = $stmt->execute();

        echo json_encode([
            "success" => $successasdos && $successUser,
            "deleted_asdos" => $successasdos,
            "deleted_user" => $successUser
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "User tidak ditemukan untuk asdos ini."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "ID asdos tidak ditemukan."]);
}