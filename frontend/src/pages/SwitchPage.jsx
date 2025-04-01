import React from 'react'
import LedSwitch from '../components/LedSwitch'

const SwitchPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-zinc-200 rounded-2xl p-10 shadow-xl">
        <LedSwitch />
      </div>
    </div>
  )
}

export default SwitchPage