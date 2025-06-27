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


  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

    </div>
  );
};

export default ComponentCard;
