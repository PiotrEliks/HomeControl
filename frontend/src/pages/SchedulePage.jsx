import React from 'react'
import ValveSchedule from '../components/ValveSchedule.jsx';

const SchedulePage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-zinc-200 rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center sm:min-w-3/4">
        <span className="text-3xl font-bold mb-5">HARMONOGRAMY</span>
        <ValveSchedule />
      </div>
    </div>
  )
}

export default SchedulePage