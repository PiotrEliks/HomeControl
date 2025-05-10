import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import {
  LogOut, Trees, House, Menu, X, CircleUser,
  CalendarDays, Power, ChartNoAxesCombined,
  Lightbulb, DoorClosed, ReceiptText
} from 'lucide-react';

const DashboardLayout = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed]   = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [openGarden, setOpenGarden]               = useState(false);
  const [openGardenSection, setOpenGardenSection] = useState(null);
  const [openHome, setOpenHome]                   = useState(false);

  const valves = ['valve-01','valve-02','valve-03'];

  useEffect(() => {
    const mapping = {
      switch: '/switch',
      schedule: '/schedule',
      stats: '/garden-statistics',
      logs: '/valve-logs'
    };
    let found = null;
    Object.entries(mapping).forEach(([key, prefix]) => {
      if (location.pathname === prefix || location.pathname.startsWith(prefix + '/')) {
        found = key;
      }
    });
    setOpenGarden(!!found);
    setOpenGardenSection(found);

    const homePrefixes = ['/lights','/doors','/home-statistics'];
    setOpenHome(homePrefixes.some(p => location.pathname === p || location.pathname.startsWith(p + '/')));
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  const renderValveList = (basePath) => (
    <ul className="pl-4">
      {valves.map(v => (
        <li
          key={v}
          onClick={() => handleNavigation(`${basePath}/${v}`)}
          className={`
            p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
            hover:bg-green-800/40
            ${location.pathname === `${basePath}/${v}` ? 'bg-green-800/80' : ''}
          `}
        >
          Zawór {v.split('-')[1]}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex h-screen">
      <aside className={`
        bg-green-900 text-white p-4
        ${sidebarCollapsed ? "w-18" : "w-64"}
        flex-none overflow-y-auto
        transition-all duration-300 hidden md:block
      `}>
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="mb-4 cursor-pointer hover:text-white/60"
          title={sidebarCollapsed ? "Rozwiń menu" : "Zwiń menu"}
        >
          <Menu />
        </button>

        <ul>
          <li>
            <button
              onClick={() => {
                if (openGarden) setOpenGardenSection(null);
                setOpenGarden(g => !g);
              }}
              className={`
                w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                hover:bg-green-700/80
                ${openGarden ? 'bg-green-700/80' : ''}
              `}
            >
              <Trees /> {!sidebarCollapsed && 'Ogród'}
            </button>

            {openGarden && !sidebarCollapsed && (
              <ul className="pl-4">
                {[
                  { key: 'switch', icon: <Power />, label: 'On/Off', path: '/switch' },
                  { key: 'schedule', icon: <CalendarDays />, label: 'Harmonogram', path: '/schedule' },
                  { key: 'stats', icon: <ChartNoAxesCombined />, label: 'Statystyki', path: '/garden-statistics' },
                  { key: 'logs', icon: <ReceiptText />, label: 'Rejestr zdarzeń', path: '/valve-logs' },
                ].map(sec => (
                  <li key={sec.key}>
                    <button
                      onClick={() =>
                        setOpenGardenSection(s => s === sec.key ? null : sec.key)
                      }
                      className={`
                        w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                        hover:bg-green-800/40
                        ${openGardenSection === sec.key ? 'bg-green-800/80' : ''}
                      `}
                    >
                      {sec.icon} {sec.label}
                    </button>
                    {openGardenSection === sec.key && renderValveList(sec.path)}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={() => setOpenHome(h => !h)}
              className={`
                w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer
                hover:bg-green-700/80
                ${openHome ? 'bg-green-700/80' : ''}
              `}
            >
              <House /> {!sidebarCollapsed && 'Dom'}
            </button>
            {openHome && !sidebarCollapsed && (
              <ul className="pl-4">
                <li
                  onClick={() => handleNavigation('/lights')}
                  className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                >
                  <Lightbulb /> Światła
                </li>
                <li
                  onClick={() => handleNavigation('/doors')}
                  className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                >
                  <DoorClosed /> Drzwi
                </li>
                <li
                  onClick={() => handleNavigation('/home-statistics')}
                  className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
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
            className="mb-4 cursor-pointer"
          >
            <X />
          </button>
          <ul>
            <li>
              <button
                onClick={() => {
                  if (openGarden) setOpenGardenSection(null);
                  setOpenGarden(g => !g);
                }}
                className="w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-700/80"
              >
                <Trees /> Ogród
              </button>
              {openGarden && (
                <ul className="pl-4">
                  {[
                    { key: 'switch', icon: <Power />, label: 'On/Off', path: '/switch' },
                    { key: 'schedule', icon: <CalendarDays />, label: 'Harmonogram', path: '/schedule' },
                    { key: 'stats', icon: <ChartNoAxesCombined />, label: 'Statystyki', path: '/garden-statistics' },
                    { key: 'logs', icon: <ReceiptText />, label: 'Rejestr zdarzeń', path: '/valve-logs' },
                  ].map(sec => (
                    <li key={sec.key}>
                      <button
                        onClick={() =>
                          setOpenGardenSection(s => s === sec.key ? null : sec.key)
                        }
                        className="w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                      >
                        {sec.icon} {sec.label}
                      </button>
                      {openGardenSection === sec.key && renderValveList(sec.path)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setOpenHome(h => !h)}
                className="w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-700/80"
              >
                <House /> Dom
              </button>
              {openHome && (
                <ul className="pl-4">
                  <li
                    onClick={() => handleNavigation('/lights')}
                    className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                  >
                    <Lightbulb /> Światła
                  </li>
                  <li
                    onClick={() => handleNavigation('/doors')}
                    className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                  >
                    <DoorClosed /> Drzwi
                  </li>
                  <li
                    onClick={() => handleNavigation('/home-statistics')}
                    className="p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-green-800/40"
                  >
                    <ChartNoAxesCombined /> Statystyki
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <nav className="bg-white text-black p-2 flex justify-between items-center border-b md:justify-end">
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMobileSidebarOpen(o => !o)}
          >
            <Menu />
          </button>
          <div className="flex items-center gap-2">
            <CircleUser /> {authUser.fullName}
            <button
              onClick={logout}
              className="bg-green-900 hover:bg-green-700 text-white px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <LogOut /> Wyloguj
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
