import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNamaMatakuliah, setNewNamaMatakuliah] = useState("");

  const handleAddSubmit = async () => {
    try {
      console.log(newNamaMatakuliah);
      const response = await fetch("http://localhost/peer_assesment/backend/insert_matakuliah.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_matakuliah: newNamaMatakuliah }),
      });

      const res = await response.json();
      if (res.success) {
        setShowAddModal(false);
        setNewNamaMatakuliah("");
        window.location.reload(); // Untuk reload data dari parent
      } else {
        alert("Gagal tambah: " + res.error);
      }
    } catch (err) {
      alert("Gagal menghubungi server. ");
      console.log(err);
    }
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Tambah</Button>
      </div>

      {/* Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Modal Tambah */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tambah Mata Kuliah</Dialog.Title>
          <Input
            type="text"
            value={newNamaMatakuliah}
            onChange={(e) => setNewNamaMatakuliah(e.target.value)}
            placeholder="Nama Mata Kuliah"
            className="mb-4"
          />
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
