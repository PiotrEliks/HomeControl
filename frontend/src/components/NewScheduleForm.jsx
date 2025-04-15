import React, { useState } from 'react';
import { useValveStore } from '../store/useValveStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const NewScheduleForm = () => {
  const { createValveSchedule } = useValveStore();
  const [selectedDays, setSelectedDays] = useState([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const { authUser } = useAuthStore();

  const daysOfWeek = [
    { label: 'Poniedziałek', value: 1 },
    { label: 'Wtorek', value: 2 },
    { label: 'Środa', value: 3 },
    { label: 'Czwartek', value: 4 },
    { label: 'Piątek', value: 5 },
    { label: 'Sobota', value: 6 },
    { label: 'Niedziela', value: 0 },
  ];

  const handleDayChange = (e) => {
    const day = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!openTime || !closeTime || selectedDays.length === 0) {
      alert("Wprowadź wszystkie wymagane dane.");
      return;
    }

    const [openHourStr, openMinuteStr] = openTime.split(':');
    const [closeHourStr, closeMinuteStr] = closeTime.split(':');
    const openHour = parseInt(openHourStr, 10);
    const openMinute = parseInt(openMinuteStr, 10);
    const closeHour = parseInt(closeHourStr, 10);
    const closeMinute = parseInt(closeMinuteStr, 10);

    await createValveSchedule(selectedDays, openHour, openMinute, closeHour, closeMinute, authUser.fullName);

    setSelectedDays([]);
    setOpenTime('');
    setCloseTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border mb-4 rounded-lg">
      <div className="mb-2">
        <label className="block font-bold mb-1">Wybierz dni:</label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <label key={day.value} className="inline-flex items-center">
              <input
                type="checkbox"
                value={day.value}
                checked={selectedDays.includes(day.value)}
                onChange={handleDayChange}
                className="mr-1"
              />
              {day.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="block font-bold mb-1" htmlFor="openTime">Czas otwarcia:</label>
        <input
          id="openTime"
          type="time"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold mb-1" htmlFor="closeTime">Czas zamknięcia:</label>
        <input
          id="closeTime"
          type="time"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        Zapisz harmonogram
      </button>
    </form>
  );
};

export default NewScheduleForm;
