<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json");
header("Content-Type: application/json; charset=utf-8");

// Tangani preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "db_peer_eval");
$data = json_decode(file_get_contents("php://input"), true);

$nama          = $conn->real_escape_string($data['nama_pengelompokan']);
$id_matakuliah = $conn->real_escape_string($data['id_matakuliah']);

if ($nama && $id_matakuliah) {
    $query = "INSERT INTO pengelompokan (nama_pengelompokan, id_matakuliah)
    VALUES ('$nama', '$id_matakuliah')";

    if ($conn->query($query)) {
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } else {
        echo json_encode([
            "success" => false,
            "error"   => "Gagal insert: " . $conn->error
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Data tidak lengkap"]);
}

$conn->close();
exit;
