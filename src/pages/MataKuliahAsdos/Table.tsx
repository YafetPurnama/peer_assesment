import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Matakuliah {
  id: number;
  nama_matakuliah: string;
}

export default function BasicTableOne({ idAsdos }: { idAsdos: number }) {
  const [data, setData] = useState<Matakuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("User belum login");
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(userData);
    fetch("http://localhost/peer_assesment/backend/get_matakuliah_by_id.php?id_asdos=" + id)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        setData(
          json.matakuliah.map((item: any) => ({
            id: Number(item.id_matakuliah),
            nama_matakuliah: String(item.nama_matakuliah),
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [idAsdos]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">
                Nama Mata Kuliah
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell className="px-5 py-4">Memuat data...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-red-500">Terjadi kesalahan: {error}</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4">Tidak ada data.</TableCell>
              </TableRow>
            ) : (
              data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">
                    {m.nama_matakuliah}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
