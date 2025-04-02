import React, { useEffect, useState } from 'react'
import { useLedStore } from '../store/useLedStore.js';
import { Trash2 } from 'lucide-react';

const LedSchedule = () => {
  const { schedules, createLedSchedule, deleteLedSchedule, getLedSchedules } = useLedStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    getLedSchedules();
  }, [getLedSchedules])

  console.log(schedules)

  function getDayOfWeek(values) {
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
      hour: schedule.hour,
      minute: schedule.minute,
      type: schedule.type,
      cronJobId: schedule.cronJobId
    });
  };

  const handleDeleteSchedule = (cronJobId) => {
    deleteLedSchedule(cronJobId);
    setShowDeleteConfirmation(false);
    setScheduleToDelete({});
  };

  const handleCancelDeleteSchedule = () => {
    setShowDeleteConfirmation(false);
    setScheduleToDelete({});
  };

  console.log(scheduleToDelete)

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 font-bold text-sm border-b pb-2 text-center items-center">
        <div>Dni</div>
        <div>Czas</div>
        <div>Typ</div>
        <div>Ustawione przez</div>
      </div>
      {schedules.map((schedule) => (
        <div id={schedule.cronJobId} className="grid grid-cols-5 gap-2 text-sm border-b py-2 text-center items-center">
          <div>{getDayOfWeek(schedule.days)}</div>
          <div>{schedule.hour}:{schedule.minute}</div>
          <div>{schedule.type === 'open' ? 'Włączenie' : 'Wyłączenie'}</div>
          <div>{schedule.createdBy}</div>
          <div>
            <button
              className="flex flex-row items-center gap-1 bg-red-700 text-white rounded-xl px-2 py-0.5 hover:bg-red-700/70 cursor-pointer"
              onClick={() => {handleShowDeleteConfirmationWindow(schedule)}}
            >
              <Trash2 /> Usuń
            </button>
          </div>
        </div>
      ))}
      {
        showDeleteConfirmation &&
        <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Na pewno chcesz usunąć harmonogram: <span className="font-bold">{scheduleToDelete.type === 'open' ? 'Włączenia' : 'Wyłączenia'}, w {getDayOfWeek(scheduleToDelete.days)}, o {scheduleToDelete.hour}:{scheduleToDelete.minute}</span>?
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => handleDeleteSchedule(scheduleToDelete.cronJobId)}
              className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer"
            >
              Potwierdź
            </button>
            <button
              onClick={() => handleCancelDeleteSchedule()}
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default LedSchedule