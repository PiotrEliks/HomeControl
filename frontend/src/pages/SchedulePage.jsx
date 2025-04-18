import React from 'react'
import ValveSchedule from '../components/ValveSchedule.jsx';

const SchedulePage = () => {
  return (
    <div className="p-2 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold mb-5">HARMONOGRAMY</span>
      <ValveSchedule />
    </div>
  )
}

export default SchedulePage