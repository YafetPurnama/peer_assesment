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
$data = json_decode(file_get_contents("php://input"), true);

$nama = $conn->real_escape_string($data['nama_mahasiswa']);
$telepon = $conn->real_escape_string($data['no_telepon']);
$email = $conn->real_escape_string($data['email']);
$username = $conn->real_escape_string($data['username']);
$password = password_hash($conn->real_escape_string($data['password']), PASSWORD_DEFAULT);
$nip = $conn->real_escape_string($data['nip']);


// Cek apakah username sudah ada
$cek = $conn->query("SELECT id FROM users WHERE username = '$username'");
if ($cek->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Username sudah digunakan"]);
    exit;
}

// Insert ke tabel user
if ($conn->query("INSERT INTO users (email,username, password) VALUES ('$email', '$username', '$password')")) {
    $id_user = $conn->insert_id;

    // Insert ke tabel mahasiswa
    $query = "INSERT INTO mahasiswa (nama_mahasiswa, no_telepon, nip, id_user) 
          VALUES ('$nama', '$telepon', '$nip', $id_user)";
    if ($conn->query($query)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Gagal insert mahasiswa: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Gagal insert user: " . $conn->error]);
}
