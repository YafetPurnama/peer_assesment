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
$id_user = isset($_GET['id_user']) ? intval($_GET['id_user']) : 0;

if ($id_user <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Parameter id_user tidak valid"
    ]);
    exit;
}

// Query untuk ambil data penilaian berdasarkan id_user
$query = "
SELECT 
    * 
FROM penilaian p
JOIN pengelompokan pg ON p.id_pengelompokan = pg.id_pengelompokan
JOIN mahasiswa m ON p.id_user = m.id_user
WHERE p.id_pengelompokan = (
    SELECT id_pengelompokan 
    FROM penilaian 
    WHERE id_user = $id_user
    LIMIT 1
)
AND p.id_user != $id_user;
";

$result = $koneksi->query($query);

if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => "Query gagal: " . $koneksi->error
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $get_data = "
        SELECT 
            * 
        FROM penilaian_detail 
        JOIN penilaian  ON penilaian.id_penilaian = penilaian_detail.id_penilaian
        JOIN users ON penilaian_detail.dinilai_oleh = users.id
        WHERE penilaian_detail.id_penilaian = ".$row['id_penilaian']."
        AND penilaian_detail.dinilai_oleh = $id_user;
    ";
    $results = $koneksi->query($get_data);
    print_r($koneksi->error);
    if($results->num_rows==0){
        $row['score']=0;
        $row['keterangan']="-";
    }
    else{
        $hasil=$results->fetch_assoc();
        $row['score']=$hasil['score'];
        $row['keterangan']=$hasil['keterangan'];
    }
    $data[] = $row;
}

// Respon JSON
echo json_encode([
    "status" => "success",
    "pengelompokan" => $data
]);

$koneksi->close();
