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
$id_dosen = $data['id_dosen'] ?? '';

if ($id_dosen) {
    // Ambil id_user terlebih dahulu
    $stmt = $koneksi->prepare("SELECT id_user FROM dosen WHERE id_dosen = ?");
    $stmt->bind_param("i", $id_dosen);
    $stmt->execute();
    $stmt->bind_result($id_user);
    $stmt->fetch();
    $stmt->close();

    if ($id_user) {
        // Hapus dosen
        $stmt = $koneksi->prepare("DELETE FROM dosen WHERE id_dosen = ?");
        $stmt->bind_param("i", $id_dosen);
        $successdosen = $stmt->execute();
        $stmt->close();

        // Hapus user
        $stmt = $koneksi->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id_user);
        $successUser = $stmt->execute();

        echo json_encode([
            "success" => $successdosen && $successUser,
            "deleted_dosen" => $successdosen,
            "deleted_user" => $successUser
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "User tidak ditemukan untuk dosen ini."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "ID dosen tidak ditemukan."]);
}