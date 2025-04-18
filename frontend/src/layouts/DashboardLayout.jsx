import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import {
  LogOut, Trees, House, Menu, X, CircleUser,
  CalendarDays, Power, ChartNoAxesCombined,
  Lightbulb, DoorClosed
} from 'lucide-react';

const DashboardLayout = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [openGarden, setOpenGarden] = useState(false);
  const [openHome, setOpenHome]   = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setOpenGarden(['/switch','/schedule','/garden-statistics'].includes(location.pathname));
    setOpenHome(  ['/lights','/doors','/home-statistics'].includes(location.pathname));
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`
          bg-green-900 text-white p-4
          ${sidebarCollapsed ? "w-18" : "w-64"}
          flex-none
          overflow-y-auto
          transition-all duration-300
          hidden md:block
        `}
      >
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="mb-4 focus:outline-none hover:text-white/60 cursor-pointer"
          title={sidebarCollapsed ? "Rozwiń menu" : "Zwiń menu"}
        >
          <Menu />
        </button>

        <ul>
          <li>
            <button
              onClick={() => {
                if (!sidebarCollapsed) {
                  setOpenGarden(g => !g)
                }
                setSidebarCollapsed(false)}}
              className={`
                w-full text-left p-2 mb-1 rounded-xl focus:outline-none cursor-pointer
                hover:bg-green-700/80
                ${openGarden ? 'bg-green-700/80' : ''}
              `}
            >
              <div className="flex items-center gap-1">
                <Trees />
                {!sidebarCollapsed && 'Ogród'}
              </div>
            </button>
            {openGarden && !sidebarCollapsed && (
              <ul className="pl-4">
                <li
                  onClick={() => handleNavigation('switch')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/switch' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <Power /> On/Off
                </li>
                <li
                  onClick={() => handleNavigation('schedule')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/schedule' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <CalendarDays /> Harmonogram
                </li>
                <li
                  onClick={() => handleNavigation('garden-statistics')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/garden-statistics' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <ChartNoAxesCombined /> Statystyki
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={() => {
                if (!sidebarCollapsed) {
                  setOpenHome(g => !g)
                }
                setSidebarCollapsed(false)}}
              className={`
                w-full text-left p-2 mb-1 rounded-xl focus:outline-none cursor-pointer
                hover:bg-green-700/80
                ${openHome ? 'bg-green-700/80' : ''}
              `}
            >
              <div className="flex items-center gap-1">
                <House />
                {!sidebarCollapsed && 'Dom'}
              </div>
            </button>
            {openHome && !sidebarCollapsed && (
              <ul className="pl-4">
                <li
                  onClick={() => handleNavigation('lights')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/lights' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <Lightbulb /> Światła
                </li>
                <li
                  onClick={() => handleNavigation('doors')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/doors' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <DoorClosed /> Drzwi
                </li>
                <li
                  onClick={() => handleNavigation('home-statistics')}
                  className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/home-statistics' ? 'bg-green-800/80' : ''}
                  `}
                >
                  <ChartNoAxesCombined /> Statystyki
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-green-900 text-white p-4 md:hidden overflow-y-auto">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="mb-4 focus:outline-none cursor-pointer"
          >
            <X />
          </button>

          <ul>
            <li>
              <button
                onClick={() => setOpenGarden(g => !g)}
                className={`w-full text-left p-2 mb-1 rounded-xl hover:bg-green-700/80 flex items-center gap-1 ${
                  openGarden ? 'bg-green-700/80' : ''
                }`}
              >
                <Trees /> Ogród
              </button>
              {openGarden && (
                <ul className="pl-4">
                  <li onClick={() => handleNavigation('switch')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/switch' ? 'bg-green-800/80' : ''}
                  `}>
                    <Power /> On/Off
                  </li>
                  <li onClick={() => handleNavigation('schedule')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/schedule' ? 'bg-green-800/80' : ''}
                  `}>
                    <CalendarDays /> Harmonogram
                  </li>
                  <li onClick={() => handleNavigation('garden-statistics')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/garden-statistics' ? 'bg-green-800/80' : ''}
                  `}>
                    <ChartNoAxesCombined /> Statystyki
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setOpenHome(h => !h)}
                className={`w-full text-left p-2 mb-1 rounded-xl hover:bg-green-700/80 flex items-center gap-1 ${
                  openHome ? 'bg-green-700/80' : ''
                }`}
              >
                <House /> Dom
              </button>
              {openHome && (
                <ul className="pl-4">
                  <li onClick={() => handleNavigation('lights')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/lights' ? 'bg-green-800/80' : ''}
                  `}>
                    <Lightbulb /> Światła
                  </li>
                  <li onClick={() => handleNavigation('doors')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/doors' ? 'bg-green-800/80' : ''}
                  `}>
                    <DoorClosed /> Drzwi
                  </li>
                  <li onClick={() => handleNavigation('home-statistics')} className={`
                    p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                    hover:bg-green-800/40
                    ${location.pathname === '/home-statistics' ? 'bg-green-800/80' : ''}
                  `}>
                    <ChartNoAxesCombined /> Statystyki
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <nav className="bg-white text-black p-2 flex justify-between md:justify-end items-center border-b flex-none">
          <button
            className="md:hidden focus:outline-none cursor-pointer justify-self-start"
            onClick={() => setMobileSidebarOpen(s => !s)}
          >
            <Menu />
          </button>
          <div className="flex items-center gap-2">
            <CircleUser />
            {authUser.fullName}
            <button
              onClick={logout}
              className="bg-green-900 hover:bg-green-700 text-white px-3 py-1 rounded-xl flex flex-row items-center justify-center gap-1 cursor-pointer"
              title="Wyloguj"
            >
              <LogOut /> <span className="ml-1">Wyloguj</span>
            </button>
          </div>
        </nav>
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
