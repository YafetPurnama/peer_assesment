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

interface Mahasiswa {
  id: number;
  nama_mahasiswa: string;
  no_telepon: string;
  username: string;
  nip: string;
  id_user: string;
}

export default function MahasiswaTable() {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Mahasiswa | null>(null);
  const [newNama, setNewNama] = useState("");
  const [newTelepon, setNewTelepon] = useState("");
  const [newNip, setNewNip] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newId, setNewId] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Mahasiswa | null>(null);

  const fetchData = () => {
    fetch("http://localhost/peer_assesment/backend/get_mahasiswa.php")
      .then((res) => res.json())
      .then((json) => {
        setData(
          json.mahasiswa.map((item: any) => ({
            id: Number(item.id_mahasiswa),
            nama_mahasiswa: item.nama_mahasiswa,
            no_telepon: item.no_telepon,
            username: item.username,
            nip: item.nip,
            id_user: item.id_user
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (item: Mahasiswa) => {
    setEditingItem(item);
    setSelectedId(item.id);
    setNewNama(item.nama_mahasiswa);
    setNewTelepon(item.no_telepon);
    setNewNip(item.nip);
    setNewId(item.id_user);
    console.log(newId);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    const payload: any = {
      id_mahasiswa: selectedId,
      nama_mahasiswa: newNama,
      nip: newNip,
      id_user: newId,
      no_telepon: newTelepon,
    };

    if (newPassword.trim() !== "") {
      payload.password = newPassword; // kirim hanya jika diisi
    }
    console.log(newId);
    const res = await fetch("http://localhost/peer_assesment/backend/update_mahasiswa.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (res.success) {
      setShowModal(false);
      fetchData();
    } else {
      alert("Gagal update: " + res.error);
    }
  };

  const openDeleteModal = (item: Mahasiswa) => {
    setDeletingItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const res = await fetch("http://localhost/peer_assesment/backend/delete_mahasiswa.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_mahasiswa: deletingItem?.id }),
    }).then((res) => res.json());

    if (res.success) {
      setDeleteModal(false);
      fetchData();
    } else {
      alert("Gagal hapus: " + res.error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="w-16 px-5 py-3 font-bold text-start text-theme-xl text-black-500 dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">Nama Mahasiswa</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">NRP</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">No Telepon</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">Username</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">Aksi</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="px-5 py-4">Memuat data...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-red-500">{error}</TableCell>
              </TableRow>
            ) : (
                data.map((m, idx) => (
                  <TableRow key={m.id}>
                    <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nama_mahasiswa}</TableCell>
                    <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nip}</TableCell> 
                    <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.no_telepon}</TableCell>
                    <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.username}</TableCell>
                    <TableCell className="px-5 py-4 space-x-2">
                      <Button onClick={() => openEditModal(m)}>Edit</Button>
                      <Button variant="destructive" onClick={() => openDeleteModal(m)}>Hapus</Button>
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
            {/* Backdrop / Overlay */}
            <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />

            {/* Container untuk memusatkan modal */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                    <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Mahasiswa
                    </Dialog.Title>

                    <div className="mt-4 space-y-4">
                        {/* Nama */}
                        <Input
                            type="text"
                            value={newNama}
                            onChange={(e) => setNewNama(e.target.value)}
                            placeholder="Nama Mahasiswa"
                        />

                        {/* NIP */}
                        <Input
                            type="text"
                            value={newNip}
                            onChange={(e) => setNewNip(e.target.value)}
                            placeholder="NIP"
                        />

                        {/* No Telepon */}
                        <Input
                            type="text"
                            value={newTelepon}
                            onChange={(e) => setNewTelepon(e.target.value)}
                            placeholder="No Telepon"
                        />

                        {/* Username (readonly) */}
                        <Input
                            type="text"
                            value={editingItem?.username || ""}
                            disabled
                            // Tambahkan styling untuk input yang disabled di dark mode
                            className="disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                            placeholder="Username"
                        />

                        {/* Ganti Password (opsional) */}
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ganti Password (biarkan kosong)"
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={() => setShowModal(false)} variant="secondary">
                            Batal
                        </Button>
                        <Button onClick={handleEditSubmit}>Simpan</Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>



      {/* Modal Hapus */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold mb-4">Hapus Mahasiswa</Dialog.Title>
          <p className="mb-4">Yakin hapus <strong>{deletingItem?.nama_mahasiswa}</strong>?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setDeleteModal(false)} variant="secondary">Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
