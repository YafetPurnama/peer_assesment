<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "db_peer_eval");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Koneksi gagal: " . $conn->connect_error]);
    exit();
}

$id_asdos = isset($_GET['id_asdos']) ? $conn->real_escape_string($_GET['id_asdos']) : null;

if (!$id_asdos) {
    echo json_encode(["success" => false, "error" => "Parameter id_asdos diperlukan."]);
    exit();
}

// Ambil daftar id_matakuliah dari asdos
$matkulQuery = "SELECT id_matakuliah FROM hak_akses WHERE id_asdos = '$id_asdos'";
$matkulResult = $conn->query($matkulQuery);

$matkulIds = [];
while ($row = $matkulResult->fetch_assoc()) {
    $matkulIds[] = "'" . $row['id_matakuliah'] . "'";
}

if (count($matkulIds) === 0) {
    echo json_encode(["success" => true, "pengelompokan" => []]);
    exit();
}

$matkulInClause = implode(",", $matkulIds);

$query = "SELECT pg.id_pengelompokan, pg.nama_pengelompokan, pg.id_matakuliah, mk.nama_matakuliah
          FROM pengelompokan pg
          JOIN matakuliah mk ON pg.id_matakuliah = mk.id_matakuliah
          WHERE pg.id_matakuliah IN ($matkulInClause)";

$result = $conn->query($query);
$pengelompokan = [];

while ($row = $result->fetch_assoc()) {
    // Ambil penilaian untuk setiap pengelompokan
    $id_pengelompokan = $row['id_pengelompokan'];
    $penilaianQuery = "SELECT *  FROM penilaian join mahasiswa on penilaian.id_user = mahasiswa.id_user where penilaian.id_pengelompokan = '".$row['id_pengelompokan']."'";
    $penilaianResult = $conn->query($penilaianQuery);
    print_r($conn->error);
    $penilaian = [];

    while ($pen = $penilaianResult->fetch_assoc()) {
        $penilaian[] = $pen;
    }

    $row['penilaian'] = $penilaian;
    $pengelompokan[] = $row;
}

echo json_encode(["success" => true, "pengelompokan" => $pengelompokan]);
?>
