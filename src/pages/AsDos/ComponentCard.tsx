import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

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
  const [namaAsDos, setNamaAsDos] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [nip, setNip] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // ✅ Tambah email

  const handleAddSubmit = async () => {
    console.log(JSON.stringify({
      nama_asdos: namaAsDos,
      no_telepon: noTelepon,
      username: username,
      password: password,
      nip: nip,
      email: email,
    }));

    try {
      const response = await fetch("http://localhost/peer_assesment/backend/insert_asdos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_asdos: namaAsDos,
          no_telepon: noTelepon,
          username: username,
          password: password,
          nip: nip,
          email: email, // ✅ kirim email
        }),
      });

      const res = await response.json();
      if (res.success) {
        setShowAddModal(false);
        setNamaAsDos("");
        setNoTelepon("");
        setUsername("");
        setPassword("");
        setNip("");
        setEmail(""); // reset email
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

      {/* Modal Tambah Asisten Dosen & User */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tambah Asisten Dosen</Dialog.Title>

          <Input
            type="text"
            value={namaAsDos}
            onChange={(e) => setNamaAsDos(e.target.value)}
            placeholder="Nama Asisten Dosen"
            className="mb-4"
          />
          <Input
            type="text"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            placeholder="NRP"
            className="mb-4"
          />
          <Input
            type="text"
            value={noTelepon}
            onChange={(e) => setNoTelepon(e.target.value)}
            placeholder="No Telepon"
            className="mb-4"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4"
          />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mb-4"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
