import React, { useEffect } from 'react'
import ValveSchedule from '../components/ValveSchedule.jsx';
import { useParams } from 'react-router-dom';
import { useValveStore } from '../store/useValveStore.js';

const SchedulePage = () => {
  const { deviceId } = useParams();

    console.log('SchedulePage', deviceId);

  return (
    <div className="p-2 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold mb-5">HARMONOGRAMY</span>
      <ValveSchedule key={deviceId} deviceId={deviceId} />
    </div>
  )
}

export default SchedulePage