import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { Dialog } from "@headlessui/react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";

interface Matakuliah {
  id: number;
  nama_matakuliah: string;
}

export default function BasicTableOne() {
  const [data, setData] = useState<Matakuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id_matakuliah, setIdMataKuliah] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Matakuliah | null>(null);
  const [newNama, setNewNama] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Matakuliah | null>(null);

  const fetchData = () => {
    fetch("http://localhost/peer_assesment/backend/get_matakuliah.php")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
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
  }, []);

  const openEditModal = (item: Matakuliah) => {
    setEditingItem(item);
    setIdMataKuliah(item.id);
    setNewNama(item.nama_matakuliah);
    console.log(item);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
        console.log(id_matakuliah);
        const response = await fetch("http://localhost/peer_assesment/backend/update_matakuliah.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id_matakuliah, nama_matakuliah: newNama }),
        });

        const res = await response.json();
        if (res.success) {
        setShowModal(false);
        fetchData();
        } else {
        alert("Gagal update: " + res.error);
        }
    } catch (err) {
        alert("Gagal menghubungi server.");
    }
  };

  const openDeleteModal = (item: Matakuliah) => {
    setDeletingItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
        const response = await fetch("http://localhost/peer_assesment/backend/delete_matakuliah.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingItem?.id }),
        });

        const res = await response.json();
        if (res.success) {
        setDeleteModal(false);
        fetchData();
        } else {
        alert("Gagal hapus: " + res.error);
        }
    } catch (err) {
        alert("Gagal menghubungi server.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>

              <TableCell
                isHeader
                className="w-16 px-5 py-3 font-bold text-start text-theme-xl text-black-500 dark:text-gray-400"
              >
                No
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">
                Nama Mata Kuliah
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
              <TableCell colSpan={3} className="px-5 py-4">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={3} className="px-5 py-4 text-red-500">
                Terjadi kesalahan: {error}
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="px-5 py-4">
                Tidak ada data.
              </TableCell>
            </TableRow>
            ) : (
              /* tambahkan parameter index (idx) */
              data.map((m, idx) => (
                <TableRow key={m.id}>
                  {/* nomor urut */}
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">
                    {m.nama_matakuliah}
                  </TableCell>
                  <TableCell className="px-5 py-4 space-x-2">
                    <Button size="sm" onClick={() => openEditModal(m)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => openDeleteModal(m)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Mata Kuliah</Dialog.Title>
          <Input
            type="text"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowModal(false)} variant="secondary">Batal</Button>
            <Button onClick={handleEditSubmit}>Simpan</Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold mb-4">Konfirmasi Hapus</Dialog.Title>
          <p className="mb-4">Yakin ingin menghapus mata kuliah <strong>{deletingItem?.nama_matakuliah}</strong>?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setDeleteModal(false)} variant="secondary">Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}