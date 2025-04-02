import React, { useState } from 'react';
import { useLedStore } from '../store/useLedStore';
import Select from 'react-select';
import { useAuthStore } from '../store/useAuthStore';

const NewScheduleForm = () => {
  const { createLedSchedule } = useLedStore();
  const { authUser } = useAuthStore();
  const [days, setDays] = useState([]);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [type, setType] = useState('');

  const dayOptions = [
    { value: 0, label: 'Nd' },
    { value: 1, label: 'Pn' },
    { value: 2, label: 'Wt' },
    { value: 3, label: 'Śr' },
    { value: 4, label: 'Czw' },
    { value: 5, label: 'Pt' },
    { value: 6, label: 'Sb' },
  ];

  const handleSelectChange = (selectedOptions) => {
    setDays(selectedOptions.map(option => option.value));
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        createLedSchedule(days, hour, minute, authUser.fullName, type);
        setDays([]);
        setHour('');
        setMinute('');
        setType('');
    } catch (error) {
        console.error(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 sm:flex sm:flex-row sm:gap-5 sm:justify-center">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
        <label htmlFor="days">Dzień:</label>
        <Select
          id="days"
          isMulti
          options={dayOptions}
          value={dayOptions.filter(option => days.includes(option.value))}
          onChange={handleSelectChange}
          className="react-select-container"
          classNamePrefix="react-select"
          closeMenuOnSelect={false}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
        <label htmlFor="hour">Godzina:</label>
        <input
          type="number"
          id="hour"
          name="hour"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="rounded-md p-1 pl-2 bg-white border-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
        <label htmlFor="minute">Minuta:</label>
        <input
          type="number"
          id="minute"
          name="minute"
          min="0"
          max="59"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="rounded-md p-1 pl-2 bg-white border-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
        <label htmlFor="days">Typ:</label>
        <select
          id="type"
          name="type"
          className="rounded-md p-1 bg-white border-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          onChange={handleTypeChange}
          value={type}
          required
        >
            <option>Wybierz typ</option>
            <option value="open">Włączenie</option>
            <option value="close">Wyłączenie</option>
        </select>
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-lg cursor-pointer"
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};

export default NewScheduleForm;
