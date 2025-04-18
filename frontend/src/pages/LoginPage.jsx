import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Mail, Lock, Eye, EyeOff, LoaderCircle } from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
      setError("Wszystkie pola są wymagane!");
    } else {
      setError("");
      login(formData);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-lime-600 to-green-900 flex items-center justify-center">
      <div className="bg-white w-full m-5 rounded-2xl shadow-2xl flex flex-col justify-center items-center sm:w-7/8 sm:m-0 md:w-4/5 lg:w-2/3 xl:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="w-full px-3 py-8 space-y-4 sm:px-8"
        >
          <div className="w-full relative">
            <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
              <span className="font-medium">
                E-mail
              </span>
            </label>
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="size-5 text-black/70 z-10" />
              </div>
              <input
                type="email"
                className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                placeholder="Wprowadź e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="w-full relative">
            <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
              <span className="font-medium">
                Hasło
              </span>
            </label>
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="size-5 text-black/70 z-10" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                title={!showPassword ? 'Pokaż hasło' : 'Ukryj hasło'}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/70" />
                ) : (
                  <Eye className="size-5 text-base-content/70" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`cursor-pointer bg-green-800 ${!isLoggingIn ? 'bg-green-800' : 'hover:bg-green-800/80'} hover:bg-green-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2 `}
            disabled={isLoggingIn}
            title="Zaloguj"
          >
            {isLoggingIn ? (
              <>
                <LoaderCircle  className="size-5 animate-spin" />
                Logowanie...
              </>
            ) : (
              "Zaloguj"
            )}
          </button>
          {error && <p className="text-red-700 text-center w-full">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage