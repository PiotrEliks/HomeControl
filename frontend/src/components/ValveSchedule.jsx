import React, { useEffect, useState } from 'react';
import { useValveStore } from '../store/useValveStore.js';
import { Trash2 } from 'lucide-react';
import NewScheduleForm from './NewScheduleForm.jsx';

const ValveSchedule = () => {
  const { schedules, deleteValveSchedule, getValveSchedules, isGettingValveSchedule } = useValveStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getValveSchedules();
  }, [getValveSchedules]);

  const getDayOfWeek = (values) => {
    const daysOfWeek = ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb'];
    return values.map(value => {
      if (value >= 0 && value <= 6) {
        return daysOfWeek[value] + " ";
      } else {
        throw new Error('Wartości muszą być w zakresie od 0 do 6');
      }
    });
  };

  const handleShowDeleteConfirmationWindow = (schedule) => {
    setShowDeleteConfirmation(true);
    setScheduleToDelete({
      id: schedule.id,
      days: schedule.days,
      openHour: schedule.openHour,
      openMinute: schedule.openMinute,
      closeHour: schedule.closeHour,
      closeMinute: schedule.closeMinute,
      createdBy: schedule.createdBy,
      openCronJobId: schedule.openCronJobId
    });
  };

  const handleDeleteSchedule = (scheduleId) => {
    deleteValveSchedule(scheduleId);
    setShowDeleteConfirmation(false);
    setScheduleToDelete(null);
  };

  const handleCancelDeleteSchedule = () => {
    setShowDeleteConfirmation(false);
    setScheduleToDelete(null);
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  return (
    <div className="w-full">

      <div className="w-full flex justify-center py-3">
        {
          showForm && <NewScheduleForm onClose={setShowForm}/>
        }
        {
          !showForm &&
            <button
              className="bg-green-600 hover:bg-green-600/70 text-white rounded-lg px-2 py-1 cursor-pointer"
              onClick={() => {handleOpenForm()}}
            >
              Utwórz nowy
            </button>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_2fr_1fr] font-bold text-sm text-center items-center border bg-gray-200">
        <div className="h-full flex items-center justify-center px-2 py-1 border-b border-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">Dni</div>
        <div className="h-full flex items-center justify-center px-2 py-1 border-b border-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">Czas otwarcia</div>
        <div className="h-full flex items-center justify-center px-2 py-1 border-b border-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">Czas zamknięcia</div>
        <div className="h-full flex items-center justify-center px-2 py-1 border-b border-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">Ustawione przez</div>
        <div className="h-full flex items-center justify-center px-2 py-1">Akcje</div>
      </div>

      {schedules?.length === 0 && !isGettingValveSchedule && (
        <div className="w-full flex justify-center py-3 text-sm text-gray-800 border border-zinc-400">Brak harmonogramów</div>
      )}

      {isGettingValveSchedule && schedules?.length == 0 && (
        <div className="w-full flex justify-center py-3 text-sm text-gray-800 border border-zinc-400">Ładowanie harmonogramów...</div>
      )}

      {schedules?.map((schedule) => (
        <div key={schedule.id} className="border-b border-l grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_2fr_1fr] text-sm text-center items-center">
          <div className="py-1 border-r-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">{getDayOfWeek(schedule.days)}</div>
          <div className="py-1 border-r-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
            {schedule.openHour + 2}:{schedule.openMinute < 10 ? '0' + schedule.openMinute : schedule.openMinute}
          </div>
          <div className="py-1 border-r-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">
            {schedule.closeHour + 2}:{schedule.closeMinute < 10 ? '0' + schedule.closeMinute : schedule.closeMinute}
          </div>
          <div className="py-1 border-r-1 border-b border-b-zinc-400 lg:border-r-1 lg:border-b-0 lg:border-black">{schedule.createdBy}</div>
          <div className="py-0.5 border-r-1">
            <button
              className="flex flex-row items-center justify-self-center gap-1 bg-red-700 text-white rounded px-2 py-0.5 hover:bg-red-700/70 cursor-pointer"
              onClick={() => handleShowDeleteConfirmationWindow(schedule)}
            >
              <Trash2 size={16} /> Usuń
            </button>
          </div>
        </div>
      ))}

      {showDeleteConfirmation && scheduleToDelete && (
        <div className={`w-full h-full ${showDeleteConfirmation ? 'backdrop-blur-sm' : ''} fixed top-0 left-0 flex justify-center items-center`}>
          <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Na pewno chcesz usunąć harmonogram:{" "}
            <span className="font-bold">
              Otwarcie: {scheduleToDelete.openHour}:{scheduleToDelete.openMinute < 10 ? '0' + scheduleToDelete.openMinute : scheduleToDelete.openMinute}, Zamknięcie: {scheduleToDelete.closeHour}:{scheduleToDelete.closeMinute < 10 ? '0' + scheduleToDelete.closeMinute : scheduleToDelete.closeMinute} dla dni: {getDayOfWeek(scheduleToDelete.days)}
            </span>?
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => handleDeleteSchedule(scheduleToDelete.openCronJobId)}
                className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer"
              >
                Potwierdź
              </button>
              <button
                onClick={handleCancelDeleteSchedule}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl cursor-pointer"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValveSchedule;
