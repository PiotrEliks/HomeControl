import React, { useState, useEffect } from 'react';
import { useValveStore } from '../store/useValveStore.js';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const GardenStatisticsPage = () => {
  const {
    valveSessions,
    sessionsMeta,
    isGettingValveSessions,
    getValveSessions
  } = useValveStore();

  const [filters, setFilters] = useState({
    openDate: '',
    closeDate: '',
    openedBy: '',
    closedBy: '',
    method: ''
  });
  const [sortBy, setSortBy] = useState('openAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPage(1);
  }, []);

  const fetchPage = (page) => {
    const { totalPages } = sessionsMeta;
    if (page < 1 || (totalPages && page > totalPages)) return;
    getValveSessions({
      ...filters,
      sortBy,
      sortOrder,
      limit: sessionsMeta.perPage,
      page
    });
  };

  const handleSearch = () => {
    fetchPage(1);
  };

  const formatDuration = (duration) => {
    if (typeof duration !== 'number' || duration < 0) return '—';
    const hours   = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    const two = n => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${two(minutes)}:${two(seconds)}`;
    }
    if (minutes > 0) {
      return `${minutes}:${two(seconds)}`;
    }
    return `${seconds}s`;
  };


  return (
    <div className="p-2 flex items-center justify-center flex-col">
      <span className="text-3xl font-bold mb-5">REJESTR ZDARZEŃ ZAWORU</span>

      <div className="w-full flex justify-center py-3">
        {
          !showFilters &&
            <button
              onClick={() => setShowFilters(true)}
              className="bg-green-600 hover:bg-green-600/70 text-white rounded-lg px-2 py-1 cursor-pointer"
            >
              Pokaż filtry
            </button>
        }
      </div>
      {
        showFilters &&
          <div className="p-4 border mb-4 rounded-lg relative w-full">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-2 right-2"
            >
              <X className="size-5 cursor-pointer text-red-500 hover:text-red-500/50" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block mb-1">Data otwarcia:</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={filters.openDate}
                  onChange={e => setFilters(f => ({ ...f, openDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1">Data zamknięcia:</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={filters.closeDate}
                  onChange={e => setFilters(f => ({ ...f, closeDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1">Otwarte przez:</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  placeholder="Wpisz osobę"
                  value={filters.openedBy}
                  onChange={e => setFilters(f => ({ ...f, openedBy: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-1">Zamknięte przez:</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  placeholder="Wpisz osobę"
                  value={filters.closedBy}
                  onChange={e => setFilters(f => ({ ...f, closedBy: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-end">
              <div>
                <label className="block mb-1">Metoda:</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={filters.method}
                  onChange={e => setFilters(f => ({ ...f, method: e.target.value }))}
                >
                  <option value="">Wszystkie</option>
                  <option value="manual">Ręcznie</option>
                  <option value="schedule">Harmonogram</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Sortuj po:</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border rounded px-2 py-1"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="openAt">Otwarcie</option>
                    <option value="closeAt">Zamknięcie</option>
                    <option value="duration">Czas trwania</option>
                    <option value="waterFlow">Ilość wody</option>
                  </select>
                  <select
                    className="border rounded px-2 py-1"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                  >
                    <option value="asc">rosnąco</option>
                    <option value="desc">malejąco</option>
                  </select>
                </div>
              </div>
              <div className="text-center flex items-center justify-center">
                <button
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-600/60 text-white px-4 py-2 rounded-lg cursor-pointer w-1/2"
                >
                  Szukaj
                </button>
              </div>
            </div>
          </div>
      }


      {isGettingValveSessions ? (
        <p>Ładuję...</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] font-bold text-sm text-center items-center border bg-gray-200">
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Otwarcie</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Zamknięcie</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Czas trwania</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Ilość wody</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Otwarte przez</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0">Zamknięte przez</div>
            <div className="h-full flex items-center justify-center px-2 py-1 border-b border-b-zinc-400  lg:border-b-0">Metoda</div>
          </div>
          {valveSessions?.map((sess) => (
            <div key={sess.id} className="border-b border-l grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] text-sm text-center items-center">
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
                {new Date(sess.openAt).toLocaleString('pl-PL')}
              </div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
                {sess.closeAt
                  ? new Date(sess.closeAt).toLocaleString('pl-PL')
                  : '—'}
              </div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
                {sess.duration
                  ? formatDuration(sess.duration)
                  : '—'}
              </div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
                {sess.waterFlow
                  ? sess.waterFlow + ' l'
                  : '—'}
              </div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">{sess.openedBy}</div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">{sess.closedBy ?? '—'}</div>
              <div className="h-full flex items-center justify-center px-2 py-1 border-r">{sess.method === 'manual' ? 'Ręcznie' : 'Harmonogram'}</div>
            </div>
          ))}
        </div>
      )}

      {valveSessions.length === 0 && !isGettingValveSessions && (
        <div className="text-center mt-4">Brak danych</div>
      )}

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => fetchPage(sessionsMeta.page - 1)}
          disabled={sessionsMeta.page <= 1}
          className="flex flex-row items-center justify-center gap-1 px-3 py-1 bg-gray-200 enabled:hover:bg-gray-200/40 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="size-4" /> Poprzednia
        </button>
        <span>Strona {sessionsMeta.page} / {sessionsMeta.totalPages}</span>
        <button
          onClick={() => fetchPage(sessionsMeta.page + 1)}
          disabled={sessionsMeta.page >= sessionsMeta.totalPages}
          className="flex flex-row items-center justify-center gap-1 px-3 py-1 bg-gray-200 enabled:hover:bg-gray-200/40 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Następna <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default GardenStatisticsPage;
