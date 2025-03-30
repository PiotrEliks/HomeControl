import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { LoaderCircle } from 'lucide-react'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen w-full bg-gradient-to-r from-lime-600 to-green-900 flex items-center justify-center">
        <LoaderCircle className="animate-spin text-white size-10"/>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
