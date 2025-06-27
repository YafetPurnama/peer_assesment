import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute"; // sesuaikan path-nya
import SignIn from "./pages/AuthPages/SignIn";
import MataKuliah from "./pages/MataKuliah/MataKuliah";
import Mahasiswa from "./pages/Mahasiswa/Mahasiswa";
import Pengelompokan from "./pages/Pengelompokan/Pengelompokan";
import Penilaian from "./pages/Penilaian/Penilaian";
import Dosen from "./pages/Dosen/Dosen";
import AsDos from "./pages/AsDos/AsDos";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import MataKuliahAsdos from "./pages/MataKuliahAsdos/MataKuliah";
import PengelompokanAsdos from "./pages/PengelompokanAsdos/Pengelompokan";
// ...import semua pages kamu

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="matakuliah" element={<MataKuliah />} />
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="dosen" element={<Dosen />} />
          <Route path="asdos" element={<AsDos />} />
          <Route path="pengelompokan" element={<Pengelompokan />} />
          <Route path="penilaian" element={<Penilaian />} />

          
          <Route path="matakuliah-asdos" element={<MataKuliahAsdos />} />
          <Route path="pengelompokan-asdos" element={<PengelompokanAsdos />} />
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
