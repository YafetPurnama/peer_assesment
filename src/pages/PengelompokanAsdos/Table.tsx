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

interface Penilaian {
  id_penilaian: string;
  id_pengelompokan: string;
  id_user: string;
  score: string;
  nama_mahasiswa: string;
  nip: string;
  keterangan: string;
}

interface Pengelompokan {
  id: number;
  nama_pengelompokan: string;
  nama_matakuliah: string;
  id_matakuliah: string;
  penilaian: Penilaian[];
}

interface MataKuliah {
  id_matakuliah: string;
  nama_matakuliah: string;
}

export default function PengelompokanTable() {
  const [data, setData] = useState<Pengelompokan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Pengelompokan | null>(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengelompokan | null>(null);
  const [showPenilaianModal, setShowPenilaianModal] = useState(false);
  const [selectedPenilaian, setSelectedPenilaian] = useState<Penilaian[]>([]);

  const [newNama, setNewNama] = useState("");
  const [newIdMatakuliah, setNewIdMatakuliah] = useState("");
  const [matakuliahOptions, setMatakuliahOptions] = useState<MataKuliah[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Pengelompokan | null>(null);
  const [newPenilaianUser, setNewPenilaianUser] = useState("");
  const [newPenilaianScore, setNewPenilaianScore] = useState("");
  const [newPenilaianKet, setNewPenilaianKet] = useState("");

  const [filteredMahasiswa, setFilteredMahasiswa] = useState<any[]>([]);
const fetchDatas = () => {
  fetch("http://localhost/peer_assesment/backend/get_pengelompokans.php")
    .then((res) => {
      console.log("Response:", res);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    });
};

  const fetchData = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("User belum login");
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(userData);
    fetch(`http://localhost/peer_assesment/backend/get_pengelompokan_by_asdos.php?id_asdos=${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.pengelompokan.map((item: any) => ({
          id: Number(item.id_pengelompokan),
          nama_pengelompokan: item.nama_pengelompokan,
          nama_matakuliah: item.nama_matakuliah,
          id_matakuliah: item.id_matakuliah,
          penilaian: item.penilaian ?? [],
        })));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  // const fetchMahasiswa = async () => {
  //   const res = await fetch("http://localhost/peer_assesment/backend/get_mahasiswa.php");
  //   const data = await res.json();
  //   if (data.success) {
  //     setMahasiswaList(data.mahasiswa); // pastikan array-nya key-nya sesuai
  //   }
  // };

  const fetchMahasiswa = async (group: Pengelompokan) => {
    if (!group) return;

    const url = new URL(
      "http://localhost/peer_assesment/backend/get_mahasiswa_pengelompokan.php"
    );

    const res = await fetch(url.toString());
    const json = await res.json();
    if (!json.success) {
      console.error(json.error);
      return;
    }


    const usedIds = new Set(
      // group.penilaian.map((p) => p.id_user)   // sudah ada penilaian
      data.flatMap(g =>
        g.id_matakuliah === group.id_matakuliah   // matkul yg sama
          ? g.penilaian.map(p => p.id_user)
          : []
      )
    );
    const bersih = (json.mahasiswa as any[]).filter(
      (m) => !usedIds.has(m.id_user) 
    );
    // setMahasiswaList(json.mahasiswa);      // simpan mentah (jika perlu)
    setFilteredMahasiswa(bersih);
  };


  // Panggil saat modal dibuka
  // useEffect(() => {
  //   if (showPenilaianModal && selectedId !== null) {
  //     const selectedGroup = data.find((item) => item.id === selectedId);
  //     if (selectedGroup) {
  //       fetchMahasiswa(selectedGroup);
  //     }
  //   }
  // }, [showPenilaianModal, selectedId, data]);

  useEffect(() => {
    if (showPenilaianModal && selectedGroup) {
      fetchMahasiswa(selectedGroup);
    }
  }, [showPenilaianModal, selectedGroup]);


  const fetchMatakuliahOptions = () => {
    fetch("http://localhost/peer_assesment/backend/get_matakuliah.php")
      .then((res) => res.json())
      .then((json) => setMatakuliahOptions(json.matakuliah))
      .catch((err) => console.error("Gagal fetch matakuliah:", err));
  };

  const handleAddPenilaian = async () => {
    const payload = {
      id_pengelompokan: selectedId, // ambil dari modal utama
      id_user: newPenilaianUser,
    };

    const res = await fetch("http://localhost/peer_assesment/backend/insert_penilaian.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (res.success) {
      // refresh data penilaian
      fetchData(); // panggil ulang get_pengelompokans
      setNewPenilaianUser("");
      setShowPenilaianModal(false);
    } else {
      alert("Gagal menambah penilaian: " + res.error);
    }
  };

  // Handler hapus penilaian
  const handleDeletePenilaian = async (id_penilaians: string) => {
    const payload = {
      id_penilaian: id_penilaians,
    };
    console.log(id_penilaians);
    const res = await fetch("http://localhost/peer_assesment/backend/delete_penilaian.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (res.success) {
      fetchData(); // refresh
    } else {
      alert("Gagal menghapus penilaian: " + res.error);
    }
    setShowPenilaianModal(false);
  };


  useEffect(() => {
    fetchData();
    fetchMatakuliahOptions();
  }, []);

  const openEditModal = (item: Pengelompokan) => {
    setEditingItem(item);
    setSelectedId(item.id);
    setNewNama(item.nama_pengelompokan);
    setNewIdMatakuliah(item.id_matakuliah);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    const payload = {
      id_pengelompokan: selectedId,
      nama_pengelompokan: newNama,
      id_matakuliah: newIdMatakuliah,
    };
    console.log(payload)
    const res = await fetch("http://localhost/peer_assesment/backend/update_pengelompokan.php", {
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

  const openDeleteModal = (item: Pengelompokan) => {
    setDeletingItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const res = await fetch("http://localhost/peer_assesment/backend/delete_pengelompokan.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pengelompokan: deletingItem?.id }),
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
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">Nama Pengelompokan</TableCell>{/* text-sm uppercase tracking-wider */}
              <TableCell isHeader className="px-5 py-3 font-bold text-black-500 text-start text-theme-xl dark:text-gray-400">Mata Kuliah</TableCell>
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
              data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nama_pengelompokan}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-200">{m.nama_matakuliah}</TableCell>
                  <TableCell className="px-5 py-4 space-x-2 text-gray-700 dark:text-gray-200">
                    <Button onClick={() => {
                      setSelectedPenilaian(m.penilaian);
                      setSelectedId(m.id);
                      setSelectedGroup(m);
                      setShowPenilaianModal(true);
                    }}>Penilaian</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Edit */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100  ">Edit Pengelompokan</Dialog.Title>

          <Input
            type="text"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            className="mb-4 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nama Pengelompokan"
          />

          <select
            value={newIdMatakuliah}
            onChange={(e) => setNewIdMatakuliah(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Pilih Mata Kuliah</option>
            {matakuliahOptions.map((mk) => (
              <option key={mk.id_matakuliah} value={mk.id_matakuliah}>
                {mk.nama_matakuliah}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowModal(false)} variant="secondary">Batal</Button>
            <Button onClick={handleEditSubmit}>Simpan</Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Hapus */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Hapus Pengelompokan</Dialog.Title>
          <p className="mb-4 text-gray-900 dark:text-white">Yakin ingin menghapus <strong>{deletingItem?.nama_pengelompokan}</strong>?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setDeleteModal(false)} variant="secondary">Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Penilaian */}
      <Dialog open={showPenilaianModal} onClose={() => setShowPenilaianModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl dark:bg-gray-800">
          {/* <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daftar Penilaian</Dialog.Title> */}
          {/* <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white"> {`Daftar Penilaian${selectedGroup ? ` ${selectedGroup.nama_pengelompokan}` : ""}`} </Dialog.Title> */}
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Daftar Penilaian{" "}
          {selectedGroup && (
            <span className="font-bold">
              {selectedGroup.nama_pengelompokan}
            </span>
          )}
        </Dialog.Title>
            {selectedPenilaian.length > 0 ? (
              <div className="grid grid-cols-5 gap-4 font-semibold border-b pb-2 mb-2 text-gray-700 dark:text-gray-300">
                <div>User</div>
                <div>NIP</div>
                <div>Score</div>
                <div>Keterangan</div>
                <div>Aksi</div>
              </div>
              ) : null}

            {selectedPenilaian.length > 0 ? (
              selectedPenilaian.map((p) => (
                <div key={p.id_penilaian}
                  // className="grid grid-cols-5 gap-4 border-b py-2 text-sm items-center"
                  className="grid grid-cols-5 gap-4 pb-2 mb-3 text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <div>{p.nama_mahasiswa}</div>
                  <div>{p.nip}</div>
                  <div>{p.score}</div>
                  <div>{p.keterangan}</  div>
                  <div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePenilaian(p.id_penilaian)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
            ))
          //   <>
          //   {/* Header */}
          //   <div className="grid grid-cols-5 gap-4 pb-2 mb-3
          //                   text-sm font-medium
          //                   border-b border-gray-200 dark:border-gray-700
          //                   text-gray-700 dark:text-gray-300">
          //     <span>User</span>
          //     <span>NIP</span>
          //     <span>Score</span>
          //     <span>Keterangan</span>
          //     <span className="text-right">Aksi</span>
          //   </div>
    
          //   {/* Rows */}
          //   <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          //     {selectedPenilaian.map(p => (
          //       <div key={p.id_penilaian}
          //           className="grid grid-cols-5 gap-4 items-center
          //                       text-sm text-gray-800 dark:text-gray-200">
          //         <span>{p.nama_mahasiswa}</span>
          //         <span>{p.nip}</span>
          //         <span>{p.score}</span>
          //         <span>{p.keterangan}</span>
          //         <Button
          //           className="justify-self-end"
          //           size="sm"
          //           variant="destructive"
          //           onClick={() => handleDeletePenilaian(p.id_penilaian)}
          //         >
          //           Hapus
          //         </Button>
          //       </div>
          //     ))}
          //   </div>
          // </>
          ) : (
            <p className="text-gray-500">Belum ada penilaian.</p>
          )}

          {/* Form Tambah Penilaian */}
          <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Tambah Penilaian</h3>

            <div className="grid grid-cols-4 gap-4 mb-4 items-center">
              <select
                value={newPenilaianUser}
                onChange={(e) => setNewPenilaianUser(e.target.value)}
                // className="border border-gray-300 rounded px-3 py-2 col-span-3"
                className="border border-gray-300 rounded px-3 py-2 col-span-3 flex-1 
                dark:border-gray-60 bg-gray-50 dark:bg-gray-700
                text-sm text-gray-900 dark:text-gray-100
                focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Mahasiswa</option>
                {/* {mahasiswaList.map((m: any) => ( */}
                {filteredMahasiswa.map((m: any) => (
                  <option key={m.id_user} value={m.id_user}>
                    {m.nama_mahasiswa} ({m.nip})
                  </option>
                ))}
              </select>

              <Button onClick={handleAddPenilaian}>Tambah</Button>
            </div>
          </div>


          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPenilaianModal(false)} variant="secondary">
              Tutup
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}