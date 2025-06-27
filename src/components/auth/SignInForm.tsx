import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router-dom";
import { TEToast } from "tw-elements-react";
import { v4 as uuidv4 } from "uuid";

export default function SignInForm() {
  type ToastType = 'error' | 'goodbye' | 'inactiveAccount' | 'warningLogin';
  
  type ToastItem = {
    id: string;
    type: ToastType;
    content: React.ReactNode;
    open: boolean;
  };

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const id = uuidv4();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const errorToast = (id: string, open: boolean, message: string) => (
    <TEToast
      className="container-toast"
      key={id}
      open={open}
      autohide
      delay={3000}
      setOpen={(value) => value === false && closeToast(id)}
      color="bg-red-100 text-red-700"
    >
      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-red-200 bg-clip-padding px-4 pb-2 pt-2.5">
        <p className="flex items-center font-bold">Loker Penyimpanan | GMS</p>
        <button type="button" onClick={() => closeToast(id)} aria-label="Close" className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none bg-transparent">
          <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        </button>
      </div>
      <div className="break-words rounded-b-lg px-4 py-4">{message}</div>
    </TEToast>
  );

  const goodbyeToast = (id: string, open: boolean) => (
    <TEToast
      className="container-toast"
      key={id}
      open={open}
      autohide
      delay={3000}
      setOpen={(value) => value === false && closeToast(id)}
      color="bg-success-100 text-success-700"
    >
      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-success/20 bg-clip-padding px-4 pb-2 pt-2.5">
        <p className="flex items-center font-bold">Loker Penyimpanan | GMS</p>
        <button type="button" onClick={() => closeToast(id)} aria-label="Close" className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none bg-transparent">
          <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        </button>
      </div>
      <div className="break-words rounded-b-lg px-4 py-4">Selamat tinggal, Anda telah berhasil keluar dari aplikasi.</div>
    </TEToast>
  );

  const inactiveAccountToast = (id: string, open: boolean) => (
    <TEToast
      className="container-toast"
      key={id}
      open={open}
      autohide
      delay={3000}
      setOpen={(value) => value === false && closeToast(id)}
      color="bg-danger-100 text-danger-700"
    >
      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-danger-200 bg-clip-padding px-4 pb-2 pt-2.5">
        <p className="flex items-center font-bold">Loker Penyimpanan | GMS</p>
        <button type="button" onClick={() => closeToast(id)} aria-label="Close" className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none">
          <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        </button>
      </div>
      <div className="break-words rounded-b-lg px-4 py-4">Akun Anda telah dinonaktifkan. Silakan hubungi admin untuk bantuan lebih lanjut.</div>
    </TEToast>
  );

  const warningLoginToast = (id: string, open: boolean) => (
    <TEToast
      className="container-toast"
      key={id}
      open={open}
      autohide
      delay={3000}
      setOpen={(value) => value === false && closeToast(id)}
      color="bg-warning-100 text-warning-700"
    >
      <div className="flex items-center justify-between rounded-t-lg border-b-2 border-warning-200 bg-clip-padding px-4 pb-2 pt-2.5">
        <p className="flex items-center font-bold">Loker Penyimpanan | GMS</p>
        <button type="button" onClick={() => closeToast(id)} aria-label="Close" className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none bg-transparent">
          <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        </button>
      </div>
      <div className="break-words rounded-b-lg px-4 py-4">Anda belum login. Silakan login terlebih dahulu untuk mengakses aplikasi ini 😊.</div>
    </TEToast>
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/peer_assesment/backend/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.user)); // simpan data user jika perlu
        if (data.user.role === "dosen") {
          navigate("/");
        } else if (data.user.role === "asdos") {
          navigate("/matakuliah-asdos");
        } else if (data.user.role === "mahasiswa") {
          navigate("/penilaian");
        }

      } else {
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan koneksi");
    }
  };

  

  return (
    <div className="flex flex-col flex-1">
      
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back 👋👋
          </h1>
          <p className="text-sm text-gray-900 dark:text-gray-400">
            {/* Please sign in to continue to your account */}
            Silakan masukan email dan password atau masuk untuk melanjutkan ke akun Anda!
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-gray-900 dark:text-white">Email 
              <span className="text-error-500  dark:text-white">*
                </span></label>
            <Input
              placeholder="akun@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-900 dark:text-white">Password 
              <span className="text-error-500 dark:text-white">*</span></label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Masukan Password Anda!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" size="sm">
              Sign in
            </Button>
          </div>
        </form>
        {/* <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-1 py-4"> */}
          <div className="mt-6 space-y-4 ">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button 
              className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" 
              // onClick={handleGoogleLogin}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
              </svg>
              Sign in with Google
            </button>

            <button 
              className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" 
              // onClick={handleMicrosoftLogin}
            >
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <rect x="17" y="17" width="10" height="10" fill="#FEBA08"></rect>
                <rect x="5" y="17" width="10" height="10" fill="#05A6F0"></rect>
                <rect x="17" y="5" width="10" height="10" fill="#80BC06"></rect>
                <rect x="5" y="5" width="10" height="10" fill="#F25325"></rect>
              </svg>
              Sign in with Microsoft
            </button>
          </div>
          </div>
        {/* </div>                 */}
      </div>
    </div>
  );
}

function closeToast(id: string): void {
  throw new Error("Function not implemented.");
}
