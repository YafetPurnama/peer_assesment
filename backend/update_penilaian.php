<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ambil input dari body (JSON)
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['id_penilaian'], $input['score'], $input['keterangan'], $input['id_user'])) {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap."]);
    exit();
}

// Koneksi DB
$koneksi = new mysqli("localhost", "root", "", "db_peer_eval");

$id_user = $input['id_user'];
$id_penilaian = $input['id_penilaian'];
$score = $input['score'];
$keterangan = $input['keterangan'];

$get_data = "
    SELECT 
        * 
    FROM penilaian_detail 
    JOIN penilaian  ON penilaian.id_penilaian = penilaian_detail.id_penilaian
    JOIN users ON penilaian_detail.dinilai_oleh = users.id
    WHERE penilaian_detail.id_penilaian = ".$id_penilaian."
    AND penilaian_detail.dinilai_oleh = $id_user;
    ";
$results = $koneksi->query($get_data);
print_r($koneksi->error);
if($results->num_rows==0){
    $results = $koneksi->query("INSERT INTO penilaian_detail (id_penilaian,dinilai_oleh,score,keterangan) values('$id_penilaian','$id_user','$score','$keterangan')");
}else{
    $results = $koneksi->query("UPDATE penilaian_detail SET score='$score',keterangan='$keterangan' where id_penilaian = $id_penilaian AND dinilai_oleh = $id_user");
}
echo json_encode(["message" => "Penilaian berhasil diperbarui"]);

// Cek koneksi
if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Gagal koneksi ke database"]);
    exit();
}



