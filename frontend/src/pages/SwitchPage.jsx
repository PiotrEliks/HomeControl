import React from 'react'
import ValveSwitch from '../components/ValveSwitch'

const SwitchPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-zinc-200 rounded-2xl p-10 shadow-xl">
        <ValveSwitch />
      </div>
    </div>
  )
}

export default SwitchPage