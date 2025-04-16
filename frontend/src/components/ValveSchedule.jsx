import React, { useEffect, useState } from 'react';
import { useValveStore } from '../store/useValveStore.js';
import { Trash2 } from 'lucide-react';
import NewScheduleForm from './NewScheduleForm.jsx';

const ValveSchedule = () => {
  const { schedules, deleteValveSchedule, getValveSchedules } = useValveStore();
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
  }

  return (
    <div className="w-full">

      <div className="w-full flex justify-center py-3">
        {
          showForm && <NewScheduleForm onClose={setShowForm}/>
        }
        {
          !showForm &&
            <button
              className="bg-green-600 hover:bg-green-600/70 text-white rounded-xl px-2 py-1 cursor-pointer"
              onClick={() => {handleOpenForm()}}
            >
              Utwórz nowy
            </button>
        }
      </div>

      <div className="grid grid-cols-5 gap-2 font-bold text-sm border-b pb-2 text-center items-center">
        <div>Dni</div>
        <div>Czas otwarcia</div>
        <div>Czas zamknięcia</div>
        <div>Ustawione przez</div>
        <div>Akcje</div>
      </div>

      {schedules?.map((schedule) => (
        <div key={schedule.id} className="grid grid-cols-5 gap-2 text-sm border-b py-2 text-center items-center">
          {console.log(schedule)}
          <div>{getDayOfWeek(schedule.days)}</div>
          <div>
            {schedule.openHour}:{schedule.openMinute < 10 ? '0' + schedule.openMinute : schedule.openMinute}
          </div>
          <div>
            {schedule.closeHour}:{schedule.closeMinute < 10 ? '0' + schedule.closeMinute : schedule.closeMinute}
          </div>
          <div>{schedule.createdBy}</div>
          <div>
            <button
              className="flex flex-row items-center justify-self-center gap-1 bg-red-700 text-white rounded-xl px-2 py-0.5 hover:bg-red-700/70 cursor-pointer"
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
