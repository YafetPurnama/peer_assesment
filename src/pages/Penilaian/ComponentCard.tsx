import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface Matakuliah {
  id: string;
  nama: string;
}

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [namaPengelompokan, setNamaPengelompokan] = useState("");
  const [idMataKuliah, setIdMataKuliah] = useState("");
  const [mataKuliahList, setMataKuliahList] = useState<Matakuliah[]>([]);

  useEffect(() => {
    fetch("http://localhost/peer_assesment/backend/get_matakuliah.php")
      .then((res) => res.json())
      .then((data) => {
        if (data?.matakuliah) {
          setMataKuliahList(
            data.matakuliah.map((item: any) => ({
              id: item.id_matakuliah,
              nama: item.nama_matakuliah,
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil mata kuliah:", err);
      });
  }, []);

  const handleAddSubmit = async () => {
    try {
      const response = await fetch("http://192.168.1.4/peer_assesment/backend/insert_pengelompokan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pengelompokan: namaPengelompokan,
          id_matakuliah: idMataKuliah,
        }),
      });

      const res = await response.json();
      if (res.success) {
        setShowAddModal(false);
        setNamaPengelompokan("");
        setIdMataKuliah("");
        window.location.reload();
      } else {
        alert("Gagal tambah: " + res.error);
      }
    } catch (err) {
      alert("Gagal menghubungi server.");
      console.error(err);
    }
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
    

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Modal Tambah */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tambah Pengelompokan</Dialog.Title>

          <Input
            type="text"
            value={namaPengelompokan}
            onChange={(e) => setNamaPengelompokan(e.target.value)}
            placeholder="Nama Pengelompokan"
            className="mb-4"
          />

          <select
            value={idMataKuliah}
            onChange={(e) => setIdMataKuliah(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          >
            <option value="">Pilih Mata Kuliah</option>
            {mataKuliahList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ComponentCard;
