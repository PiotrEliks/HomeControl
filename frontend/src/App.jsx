import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage.jsx';
import SwitchPage from './pages/SwitchPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import GardenStatisticsPage from './pages/GardenStatisticsPage.jsx';
import LightsPage from './pages/LightsPage.jsx';
import DoorsPage from './pages/DoorsPage.jsx';
import HomeStatisticsPage from './pages/HomeStatisticsPage.jsx';
import NoMatchPage from './pages/NoMatchPage.jsx';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen w-full bg-gradient-to-r from-lime-600 to-green-900 flex items-center justify-center">
        <LoaderCircle className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={authUser ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<SwitchPage />} />
          <Route path="switch" element={<SwitchPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="garden-statistics" element={<GardenStatisticsPage />} />
          <Route path="lights" element={<LightsPage />} />
          <Route path="doors" element={<DoorsPage />} />
          <Route path="home-statistics" element={<HomeStatisticsPage />} />
          <Route path="*" element={<NoMatchPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
