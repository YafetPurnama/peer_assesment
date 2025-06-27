import { useEffect, useState } from "react";
import ScoreBar from "../../components/ui/ScoreBar";

type Penilaian = {
  id_penilaian: string;
  id_pengelompokan: string;
  nama_pengelompokan: string;
  id_user: string;
  score: string;
  nama_mahasiswa: string;
  nip: string;
  keterangan: string;
};

const PenilaianTable = () => {
  const [data, setData] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Penilaian | null>(null);
  const [score, setScore] = useState<number>(0);//useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("User belum login");
      setLoading(false);
      return;
    }

    try {
      const { id } = JSON.parse(userData);
      const url = `http://localhost/peer_assesment/backend/get_penilaian_by_user_id.php?id_user=${id}`;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          setData(
            json.pengelompokan.map((item: any) => ({
              id_penilaian: item.id_penilaian,
              id_pengelompokan: item.id_pengelompokan,
              nama_pengelompokan: item.nama_pengelompokan,
              id_user: item.id_user,
              score: item.score,
              nama_mahasiswa: item.nama_mahasiswa,
              nip: item.nip,
              keterangan: item.keterangan,
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } catch (e: any) {
      setError("Gagal membaca data user dari localStorage");
      setLoading(false);
    }
  }, []);

  const handleEdit = (item: Penilaian) => {
    setSelected(item);
    // setScore(item.score);
    setScore(Number(item.score));
    setKeterangan(item.keterangan);
    setIsModalOpen(true);
  };

  // const handleUpdate = () => {
  //   if (!selected) return;

  //   fetch("http://localhost/peer_assesment/backend/update_penilaian.php", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       id_penilaian: selected.id_penilaian,
  //       score,
  //       keterangan,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       console.log("Berhasil update:", response);
  //       const updated = data.map((item) =>
  //         item.id_penilaian === selected.id_penilaian
  //           ? { ...item, score: String(score), keterangan }
  //           : item
  //       );
  //       setData(updated);
  //       setIsModalOpen(false);
  //     })
  //     .catch((err) => {
  //       alert("Gagal update penilaian");
  //       console.error(err);
  //     });
  // };

  const handleUpdate = () => {
    if (!selected) return;
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("User belum login");
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(userData);
    fetch("http://localhost/peer_assesment/backend/update_penilaian.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_penilaian: selected.id_penilaian,
        id_user: id,
        // ─── kirim sebagai string ───
        score: String(score),
        keterangan,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("Berhasil update:", response);
  
        // perbarui data di tabel
        const updated = data.map((item) =>
          item.id_penilaian === selected.id_penilaian
            ? { ...item, score: String(score), keterangan }
            : item
        );
        setData(updated);
        setIsModalOpen(false);
      })
      .catch((err) => {
        alert("Gagal update penilaian");
        console.error(err);
      });
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="overflow-x-auto mt-4">
        <h2 className="text-xl font-bold mb-4 text-black-500 text-start  dark:text-gray-100">Data Penilaian</h2>
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className= "border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"> {/* bg-gray-100 */}
            <tr>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">No</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">Kelompok</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">Mahasiswa</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">NIP</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">Skor</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200">Keterangan</th>
              <th className="border px-3 py-2 text-gray-700 dark:text-gray-200 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id_penilaian} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{index + 1}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{item.nama_pengelompokan}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{item.nama_mahasiswa}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{item.nip}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{item.score}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200">{item.keterangan}</td>
                <td className="border px-3 py-2 text-gray-700 dark:text-gray-200 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  Tidak ada data penilaian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Penilaian</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Skor Nilai</label>
              {/* <input
                type="text"
                value={score}
                // onChange={(e) => setScore(e.target.value)}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full border rounded p-2 mt-1 text-gray-900 dark:text-gray-100"
              /> */}
              {/* Score */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Score
                </label>
                <ScoreBar value={score} onChange={setScore} />
              </div>
            </div>
            <div className="mb-3 text-gray-900 dark:text-gray-100">
              <label className="block text-sm font-medium">Keterangan</label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full border rounded p-2 mt-1 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PenilaianTable;
