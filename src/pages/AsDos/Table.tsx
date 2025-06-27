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

interface AsDos {
  id: number;
  nama_asdos: string;
  no_telepon: string;
  username: string;
  nip: string;
  id_user: string;
}

interface MataKuliah {
  id_matakuliah: string;
  nama_matakuliah: string;
}

export default function AsDosTable() {
  const [data, setData] = useState<AsDos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AsDos | null>(null);
  const [newNama, setNewNama] = useState("");
  const [newTelepon, setNewTelepon] = useState("");
  const [newNip, setNewNip] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newId, setNewId] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<AsDos | null>(null);

  const [showMKModal, setShowMKModal] = useState(false);
  const [selectedMKUser, setSelectedMKUser] = useState<AsDos | null>(null);
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [selectedMKId, setSelectedMKId] = useState("");
  const [asdosMatkul, setAsdosMatkul] = useState<MataKuliah[]>([]);

  const fetchData = () => {
    fetch("http://localhost/peer_assesment/backend/get_asdos.php")
      .then((res) => res.json())
      .then((json) => {
        setData(
          json.asdos.map((item: any) => ({
            id: Number(item.id_asdos),
            nama_asdos: item.nama_asdos,
            no_telepon: item.no_telepon,
            username: item.username,
            nip: item.nip,
            id_user: item.id_user,
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

  const openEditModal = (item: AsDos) => {
    setEditingItem(item);
    setSelectedId(item.id);
    setNewNama(item.nama_asdos);
    setNewTelepon(item.no_telepon);
    setNewNip(item.nip);
    setNewId(item.id_user);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    const payload: any = {
      id_asdos: selectedId,
      nama_asdos: newNama,
      nip: newNip,
      id_user: newId,
      no_telepon: newTelepon,
    };
    if (newPassword.trim() !== "") payload.password = newPassword;

    const res = await fetch("http://localhost/peer_assesment/backend/update_asdos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (res.success) {
      setShowModal(false);
      fetchData();
    } else alert("Gagal update: " + res.error);
  };

  const openDeleteModal = (item: AsDos) => {
    setDeletingItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const res = await fetch("http://localhost/peer_assesment/backend/delete_asdos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_asdos: deletingItem?.id }),
    }).then((res) => res.json());

    if (res.success) {
      setDeleteModal(false);
      fetchData();
    } else alert("Gagal hapus: " + res.error);
  };

  const openMataKuliahModal = async (item: AsDos) => {
    setSelectedMKUser(item);
    setShowMKModal(true);

    const res = await fetch("http://localhost/peer_assesment/backend/get_matakuliah.php");
    const json = await res.json();
    if (json.success) setMataKuliahList(json.matakuliah);

    const resAsdos = await fetch("http://localhost/peer_assesment/backend/get_asdos.php");
    const jsonAsdos = await resAsdos.json();
    const currentAsdos = jsonAsdos.asdos.find((d: any) => d.id_asdos === item.id.toString());
    setAsdosMatkul(currentAsdos.matkul || []);
  };

  const handleAddMatkul = async () => {
    if (!selectedMKUser || !selectedMKId) return;
    const res = await fetch("http://localhost/peer_assesment/backend/add_matkul_asdos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_asdos: selectedMKUser.id_user, id_matakuliah: selectedMKId }),
    }).then((res) => res.json());
    if (res.success) openMataKuliahModal(selectedMKUser);
  };

  const handleDeleteMatkul = async (idMatkul: string) => {
    const res = await fetch("http://localhost/peer_assesment/backend/delete_matkul_asdos.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_asdos: selectedMKUser?.id, id_matakuliah: idMatkul }),
    }).then((res) => res.json());
    if (res.success) openMataKuliahModal(selectedMKUser!);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">No</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">Nama Asisten Dosen</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">NRP</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">No Telepon</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">Username</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-200 ">Aksi</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell>Memuat data...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell className="text-red-500">{error}</TableCell></TableRow>
            ) : (
              data.map((m,idx) => (
                <TableRow key={m.id}>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">
                      {idx + 1}
                    </TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nama_asdos}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nip}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.no_telepon}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.username}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200 space-x-2">
                    <Button onClick={() => openMataKuliahModal(m)}>Mata Kuliah</Button>
                    <Button onClick={() => openEditModal(m)}>Edit</Button>
                    <Button variant="destructive" onClick={() => openDeleteModal(m)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Mata Kuliah */}
      <Dialog open={showMKModal} onClose={() => setShowMKModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Mata Kuliah {selectedMKUser?.nama_asdos}
          </Dialog.Title>

          <ul className="mb-4 space-y-2 max-h-64 overflow-y-auto">
            {asdosMatkul.length > 0 ? (
              asdosMatkul.map((mk) => (
                <li key={mk.id_matakuliah}
                // className="flex justify-between items-center border p-2 rounded"
                className="flex justify-between items-center gap-3 p-2 rounded
               border border-gray-200  dark:border-gray-600
               bg-white               dark:bg-gray-700"
                >
                  <span className="text-gray-800 dark:text-gray-100">{mk.nama_matakuliah}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMatkul(mk.id_matakuliah)}>Hapus</Button>
                </li>
              ))
            ) : (
              <li className="text-gray-900 dark:text-gray-100">Belum ada mata kuliah</li>
            )}
          </ul>

          <div className="flex items-center gap-2 mb-4">
            <select
              // className="border p-2 rounded w-full text-gray-900 dark:text-gray-100"
              className="w-full p-2 rounded border
             border-gray-300 dark:border-gray-600
             bg-white        dark:bg-gray-700
             text-gray-900   dark:text-gray-100"
              value={selectedMKId} onChange={(e) => setSelectedMKId(e.target.value)}>
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliahList.map((mk) => (
                <option key={mk.id_matakuliah} value={mk.id_matakuliah}>{mk.nama_matakuliah}</option>
              ))}
            </select>
            <Button onClick={handleAddMatkul}>Tambah</Button>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setShowMKModal(false)}>Tutup</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      
      {/* Modal Edit DATA Asisten Dosen */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <Dialog.Panel className="bg-white p-6 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Asisten Dosen</Dialog.Title>

          {/* Nama */}
          <Input
            type="text"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            className="mb-4"
            placeholder="Nama Asisten Dosen"
          />

          {/* NIP */}
          <Input
            type="text"
            value={newNip}
            onChange={(e) => setNewNip(e.target.value)}
            className="mb-4"
            placeholder="NIP"
          />

          {/* No Telepon */}
          <Input
            type="text"
            value={newTelepon}
            onChange={(e) => setNewTelepon(e.target.value)}
            className="mb-4"
            placeholder="No Telepon"
          />

          {/* Username (readonly) */}
          <Input
            type="text"
            value={editingItem?.username || ""}
            disabled
            className="mb-4"
            placeholder="Username"
          />

          {/* Ganti Password (opsional) */}
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4"
            placeholder="Ganti Password (biarkan kosong jika tidak ingin diganti)"
          />

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowModal(false)} variant="secondary">
              Batal
            </Button>
            <Button onClick={handleEditSubmit}>Simpan</Button>
          </div>
        </Dialog.Panel>
      </Dialog>



      {/* Modal Hapus */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Hapus Asisten Dosen</Dialog.Title>
          <p className="mb-4 text-gray-900 dark:text-gray-100">Yakin hapus <strong>{deletingItem?.nama_asdos}</strong>?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setDeleteModal(false)} variant="secondary">Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </div>
        </Dialog.Panel>
      </Dialog>

    </div>

    
  );
}