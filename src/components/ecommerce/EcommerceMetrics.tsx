import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BoxIconLine,
  GroupIcon,
  AutoStories,
  AccountChildInvert,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [dashboardData, setDashboardData] = useState({
    mahasiswa: 0,
    matakuliah: 0,
    pengelompokan: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/peer_assesment/backend/get_dashboard.php")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* Mahasiswa */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <AccountChildInvert className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mahasiswa
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : dashboardData.mahasiswa}
            </h4>
          </div>
        </div>
      </div>

      {/* Mata Kuliah */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <AutoStories className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mata Kuliah
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : dashboardData.matakuliah}
            </h4>
          </div>
        </div>
      </div>

      {/* Pengelompokan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pengelompokan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : dashboardData.pengelompokan}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
