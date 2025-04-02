import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { LogOut, Trees, House, Menu, X, CircleUser } from 'lucide-react';

const DashboardLayout = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGarden, setOpenGarden] = useState(false);
  const [openHome, setOpenHome] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (location.pathname === '/switch' || location.pathname === '/schedule' || location.pathname === '/garden-statistics') {
      setOpenGarden(true);
    }

    if (location.pathname === '/lights' || location.pathname === '/doors' || location.pathname === '/home-statistics') {
      setOpenHome(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 relative">
        <aside
          className={`bg-green-900 text-white p-4 transition-all duration-500 ${
            sidebarCollapsed ? "w-18" : "w-64"
          } hidden md:block`}
        >
          <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mb-4 focus:outline-none cursor-pointer hover:text-white/60"
              title={sidebarCollapsed ? "Rozwiń menu" : "Zwiń menu"}
            >
              <Menu />
            </button>
          </div>
          <ul>
            <li>
              <button
                onClick={() => setOpenGarden(!openGarden)}
                className={`w-full text-left p-2 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer mb-1 ${
                  openGarden ? 'bg-green-700/80' : ''
                }`}
              >
                <div className="flex flex-row items-center gap-1">
                  <Trees />{sidebarCollapsed ? '' : 'Ogród'}
                </div>
              </button>
              {openGarden && !sidebarCollapsed && (
                <ul className="pl-4">
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/switch' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('switch')}
                  >
                    On/Off
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/schedule' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('schedule')}
                  >
                    Harmonogram
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/garden-statistics' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('garden-statistics')}
                  >
                    Statystyki
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setOpenHome(!openHome)}
                className={`w-full text-left p-2 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer mb-1 ${
                  openHome ? 'bg-green-700/80' : ''
                }`}
              >
                <div className="flex flex-row items-center gap-1">
                  <House />{sidebarCollapsed ? '' : 'Dom'}
                </div>
              </button>
              {openHome && !sidebarCollapsed && (
                <ul className="pl-4">
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/lights' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('lights')}
                  >
                    Światła
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/doors' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('doors')}
                  >
                    Drzwi
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/home-statistics' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => handleNavigation('home-statistics')}
                  >
                    Statystyki
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </aside>
        <div
          className={`fixed top-0 inset-x-0 h-screen z-50 bg-green-900 p-4 text-white transform transition-transform duration-500 md:hidden ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-end">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mb-4 focus:outline-none cursor-pointer"
              title="Zamknij menu"
            >
              <X />
            </button>
          </div>
          <ul>
            <li>
              <button
                onClick={() => setOpenGarden(!openGarden)}
                className={`w-full text-left p-2 mb-1 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer flex flex-row items-center gap-1 ${
                  openGarden ? 'bg-green-700/80' : ''
                }`}
              >
                <Trees />Ogród
              </button>
              {openGarden && (
                <ul className="pl-4">
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/switch' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('switch'); setMobileSidebarOpen(false); }}
                  >
                    On/Off
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/schedule' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('schedule'); setMobileSidebarOpen(false); }}
                  >
                    Harmonogram
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/garden-statistics' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('garden-statistics'); setMobileSidebarOpen(false); }}
                  >
                    Statystyki
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setOpenHome(!openHome)}
                className={`w-full text-left p-2 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer flex flex-row items-center gap-1 ${
                  openHome ? 'bg-green-700/80' : ''
                }`}
              >
                <House />Dom
              </button>
              {openHome && (
                <ul className="pl-4">
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/lights' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('lights'); setMobileSidebarOpen(false); }}
                  >
                    Światła
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/doors' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('doors'); setMobileSidebarOpen(false); }}
                  >
                    Drzwi
                  </li>
                  <li
                    className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
                      location.pathname === '/home-statistics' ? 'bg-green-800/80' : ''
                      }`}
                    onClick={() => { handleNavigation('home-statistics'); setMobileSidebarOpen(false); }}
                  >
                    Statystyki
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="flex flex-col flex-1">
          <nav className="bg-white text-black p-2 flex justify-between items-center gap-5 border-b">
            <div className="flex items-center">
              <button
                className="mr-2 md:hidden cursor-pointer hover:text-black/50"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                <Menu />
              </button>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="text-black flex flex-row items-center gap-1">
                <CircleUser />
                {authUser.fullName}
              </div>
              <button
                className="bg-green-900 hover:bg-green-900/80 px-3 py-1 rounded-xl flex items-center cursor-pointer text-white"
                onClick={() => logout()}
                title="Wyloguj"
              >
                <LogOut />
                <span className="ml-1">Wyloguj</span>
              </button>
            </div>
          </nav>
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
