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
      <LoaderCircle />
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
