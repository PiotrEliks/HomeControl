import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { LogOut, Trees, House, Menu, X, CircleUser  } from 'lucide-react';
import LedSwitch from '../components/LedSwitch.jsx';

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [openGarden, setOpenGarden] = useState(false);
  const [openHome, setOpenHome] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case 'Switch':
        return <LedSwitch />;
      case 'Schedule':
        return <div>Schedule Content</div>;
      case 'GardenStatistics':
        return <div>GardenStatistics Content</div>;
      case 'Lights':
        return <div>Lights Content</div>;
      case 'Doors':
        return <div>Doors Content</div>;
      case 'HomeStatistics':
        return <div>HomeStatistics Content</div>;
      default:
        return <div>Select a menu option</div>;
    }
  };

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
						className={`w-full text-left p-2 mb-1 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer ${
						openGarden ||
						activeMenu === 'Switch' ||
						activeMenu === 'Schedule' ||
						activeMenu === 'GardenStatistics'
							? 'bg-green-700/80'
							: ''
						}`}
					>
						{sidebarCollapsed ? <Trees onClick={() => setSidebarCollapsed(!sidebarCollapsed)} /> : "Ogród"}
					</button>
					{openGarden && !sidebarCollapsed && (
						<ul className="pl-4">
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'Switch' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('Switch')}
						>
							On/Off
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'Schedule' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('Schedule')}
						>
							Harmonogram
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'GardenStatistics' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('GardenStatistics')}
						>
							Statystyki
						</li>
						</ul>
					)}
					</li>
					<li>
					<button
						onClick={() => setOpenHome(!openHome)}
						className={`w-full text-left p-2 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer ${
						openHome ||
						activeMenu === 'Lights' ||
						activeMenu === 'Doors' ||
						activeMenu === 'HomeStatistics'
							? 'bg-green-700/80'
							: ''
						}`}
					>
						{sidebarCollapsed ? <House onClick={() => setSidebarCollapsed(!sidebarCollapsed)}/> : "Dom"}
					</button>
					{openHome && !sidebarCollapsed && (
						<ul className="pl-4">
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'Lights' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('Lights')}
						>
							Światła
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'Doors' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('Doors')}
						>
							Drzwi
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${
							activeMenu === 'HomeStatistics' ? 'bg-green-800/80' : ''
							}`}
							onClick={() => setActiveMenu('HomeStatistics')}
						>
							Statystyki
						</li>
						</ul>
					)}
					</li>
				</ul>
        	</aside>
			<div
				className={`fixed top-0 inset-x-0 h-screen z-50 bg-green-900 p-4 text-white transform transition-transform duration-500 md:hidden ${mobileSidebarOpen ? 'translate-y-0' : '-translate-y-full'}`}
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
						className={`w-full text-left p-2 mb-1 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer ${
						openGarden ||
						activeMenu === 'Switch' ||
						activeMenu === 'Schedule' ||
						activeMenu === 'GardenStatistics'
							? 'bg-green-700/80'
							: ''
						}`}
					>
						Ogród
					</button>
					{openGarden && (
						<ul className="pl-4">
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'Switch' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('Switch');
							setMobileSidebarOpen(false);
							}}
						>
							On/Off
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'Schedule' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('Schedule');
							setMobileSidebarOpen(false);
							}}
						>
							Harmonogram
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'GardenStatistics' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('GardenStatistics');
							setMobileSidebarOpen(false);
							}}
						>
							Statystyki
						</li>
						</ul>
					)}
					</li>
					<li>
					<button
						onClick={() => setOpenHome(!openHome)}
						className={`w-full text-left p-2 hover:bg-green-700/80 rounded-xl focus:outline-none cursor-pointer ${
						openHome ||
						activeMenu === 'Lights' ||
						activeMenu === 'Doors' ||
						activeMenu === 'HomeStatistics'
							? 'bg-green-700/80'
							: ''
						}`}
					>
						Dom
					</button>
					{openHome && (
						<ul className="pl-4">
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'Lights' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('Lights');
							setMobileSidebarOpen(false);
							}}
						>
							Światła
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'Doors' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('Doors');
							setMobileSidebarOpen(false);
							}}
						>
							Drzwi
						</li>
						<li
							className={`p-2 cursor-pointer hover:bg-green-800/40 rounded-xl mb-1 ${activeMenu === 'HomeStatistics' ? 'bg-green-800/80' : ''}`}
							onClick={() => {
							setActiveMenu('HomeStatistics');
							setMobileSidebarOpen(false);
							}}
						>
							Statystyki
						</li>
						</ul>
					)}
					</li>
				</ul>
			</div>
			<div className="flex flex-col flex-1">
				<nav className="bg-white text-black p-2 flex justify-between items-center gap-5 border-b-1">
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
							<CircleUser className="size-5"/>
							{authUser.fullName}
						</div>
						<button
							className="bg-green-900 hover:bg-green-900/80 px-3 py-1 rounded-xl flex items-center cursor-pointer text-white"
							onClick={() => logout()}
							title="Wyloguj"
						>
							<LogOut className="size-5"/>
							<span className="ml-1">Wyloguj</span>
						</button>
					</div>
				</nav>
				<main className="flex-1 p-4">
					{renderContent()}
				</main>
			</div>
    	</div>
    </div>
  );
};

export default HomePage;
