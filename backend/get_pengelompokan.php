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


// $sql = "SELECT m.*, u.id_matakuliah, u.nama_matakuliah
//         FROM pengelompokan m
//         JOIN matakuliah u ON m.id_matakuliah = u.id_matakuliah";
// $result = $koneksi->query($sql);

// $data = [];
// while ($row = $result->fetch_assoc()) {
//     $sql1 = "SELECT *
//         FROM penilaian join mahasiswa on penilaian.id_user = mahasiswa.id_user where penilaian.id_pengelompokan = '" . $row['id_pengelompokan'] . "'";
//     $result1 = $koneksi->query($sql1);
//     $penilaian = array();
//     while ($row1 = $result1->fetch_assoc()) {
//         $penilaian[] = $row1;
//     }
//     $row['penilaian'] = $penilaian;
//     $data[] = $row;
// }

// echo json_encode(["success" => true, "pengelompokan" => $data]);

if ($koneksi->connect_error) {
    echo json_encode(["success" => false, "error" => "Koneksi database gagal: " . $koneksi->connect_error]);
    exit();
}

// ====================================================================
// LANGKAH 1: Ambil semua data pengelompokan yang sudah diurutkan.
// ====================================================================
$pengelompokan = [];
$pengelompokan_ids = [];

$sql_pengelompokan = "
    SELECT 
        p.id_pengelompokan, 
        p.nama_pengelompokan, 
        u.nama_matakuliah
    FROM 
        pengelompokan p
    JOIN 
        matakuliah u ON p.id_matakuliah = u.id_matakuliah
    ORDER BY 
        u.nama_matakuliah ASC,
        p.nama_pengelompokan ASC";


$result_pengelompokan = $koneksi->query($sql_pengelompokan);

while ($row = $result_pengelompokan->fetch_assoc()) {
    $pengelompokan_ids[] = $row['id_pengelompokan'];
    $row['penilaian'] = [];
    $pengelompokan[$row['id_pengelompokan']] = $row;
}

// ====================================================================
// LANGKAH 2: Ambil SEMUA data penilaian yang relevan dalam SATU query.
// ====================================================================
if (!empty($pengelompokan_ids)) {
    $placeholders = implode(',', array_fill(0, count($pengelompokan_ids), '?'));
    $types = str_repeat('s', count($pengelompokan_ids));

    $sql_penilaian = "
        SELECT 
            p.*, 
            m.nama_mahasiswa,
            m.nip
        FROM 
            penilaian p 
        JOIN 
            mahasiswa m ON p.id_user = m.id_user 
        WHERE 
            p.id_pengelompokan IN ($placeholders)";

    $stmt = $koneksi->prepare($sql_penilaian);
    $stmt->bind_param($types, ...$pengelompokan_ids);
    $stmt->execute();
    $result_penilaian = $stmt->get_result();

    // ====================================================================
    // LANGKAH 3: Gabungkan data penilaian ke data pengelompokan di PHP.
    // ====================================================================
    while ($penilaian_row = $result_penilaian->fetch_assoc()) {
        $id_kelompok = $penilaian_row['id_pengelompokan'];
        $id_penilaian = $penilaian_row['id_penilaian'];

        // Ambil data penilaian_detail untuk penilaian ini dan hitung avg skor
        $get_detail = "
            SELECT AVG(score) as avg_score 
            FROM penilaian_detail 
            WHERE id_penilaian = $id_penilaian
        ";
        $result_detail = $koneksi->query($get_detail);
        $avg_score = null;

        if ($result_detail && $row_detail = $result_detail->fetch_assoc()) {
            $avg_score = round($row_detail['avg_score'], 2); // pembulatan 2 angka desimal
        }

        $penilaian_row['score'] = $avg_score;

        // Tambahkan data penilaian ke kelompok yang sesuai
        if (isset($pengelompokan[$id_kelompok])) {
            $pengelompokan[$id_kelompok]['penilaian'][] = $penilaian_row;
        }
    }

}

$data = array_values($pengelompokan);

echo json_encode(["success" => true, "pengelompokan" => $data]);
