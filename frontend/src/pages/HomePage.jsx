import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { LogOut } from 'lucide-react';

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderContent = () => {
    switch(activeMenu) {
      case 'Dashboard':
        return <div>Dashboard Content</div>;
      case 'Settings':
        return <div>Settings Content</div>;
      case 'Reports':
        return <div>Reports Content</div>;
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-2 flex justify-between items-center">
        <div className="text-xl font-bold">Panel administratora</div>
        <div className="flex items-center">
          <span className="mr-4">{authUser.fullName}</span>
          <button
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex flex-row items-center jsutify-center cursor-pointer"
            onClick={() => {logout()}}
            title="Wyloguj"
          >
            <LogOut />
            Wyloguj
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r p-4">
          <ul>
            <li
              className={`p-2 cursor-pointer ${activeMenu === 'Dashboard' ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveMenu('Dashboard')}
            >
              On/Off
            </li>
            <li
              className={`p-2 cursor-pointer ${activeMenu === 'Settings' ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveMenu('Settings')}
            >
              Harmonogram
            </li>
            <li
              className={`p-2 cursor-pointer ${activeMenu === 'Reports' ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveMenu('Reports')}
            >
              Statystyki
            </li>
          </ul>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
