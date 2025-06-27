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
  onSuccess: () => void; //ADDED NEw
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  onSuccess,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [namaPengelompokan, setNamaPengelompokan] = useState("");
  const [idMataKuliah, setIdMataKuliah] = useState("");
  const [mataKuliahList, setMataKuliahList] = useState<Matakuliah[]>([]);

  const [saving, setSaving] = useState(false);
  const isFormValid = namaPengelompokan.trim() !== "" && idMataKuliah !== "";

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
    // if (!namaPengelompokan.trim() || !idMataKuliah) {
    //   alert("Lengkapi semua kolom.");
    //   return;
    // }
    if (!isFormValid || saving) return;

    setSaving(true);
    try {
      const response = await fetch("http://localhost/peer_assesment/backend/insert_pengelompokan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_pengelompokan: namaPengelompokan,
          id_matakuliah: idMataKuliah,
        }),
      });

    //   const res = await response.json();
    //   if (res.success) {
    //     setShowAddModal(false);
    //     setNamaPengelompokan("");
    //     setIdMataKuliah("");
    //     // window.location.reload();
    //     onSuccess();
    //   } else {
    //     alert("Gagal tambah: " + res.error);
    //   }
    // } catch (err) {
    //   alert("Gagal menghubungi server.");
    //   console.error(err);
      // }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
  
      const json = await response.json().catch(() =>
        Promise.reject(new Error("Response is not valid JSON"))
      );
  
      if (!json.success) {
        alert(json.error ?? "Gagal menambah pengelompokan.");
        return;
      }
  
      setShowAddModal(false);
      setNamaPengelompokan("");
      setIdMataKuliah("");
      onSuccess();             
    } catch (e: any) {
      console.error(e);
      alert("Gagal menghubungi server atau memproses respons.");
    }
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Tambah</Button>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Modal Tambah */}
      <Dialog open={showAddModal} onClose={() => !saving && setShowAddModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 ">Tambah Pengelompokan</Dialog.Title>

          <Input
            type="text"
            value={namaPengelompokan}
            onChange={(e) => setNamaPengelompokan(e.target.value)}
            placeholder="Nama Pengelompokan"
            className="mb-4 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <select
            value={idMataKuliah}
            onChange={(e) => setIdMataKuliah(e.target.value)}
            // className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-2 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            className="w-full border px-3 py-2 mb-4 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Pilih Mata Kuliah</option>
            {mataKuliahList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 space-x-2">
            {/* <Button variant="secondary" onClick={() => setShowAddModal(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan</Button> */}
            <Button
              variant="secondary"
              disabled={saving}
              onClick={() => setShowAddModal(false)}
            >
              Batal
            </Button>

            <Button
              disabled={!isFormValid || saving}
              onClick={handleAddSubmit}
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ComponentCard;