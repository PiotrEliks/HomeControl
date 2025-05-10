import React, { useEffect } from 'react'
import ValveSwitch from '../components/ValveSwitch'
import { useParams } from 'react-router-dom'

const SwitchPage = () => {
  const { deviceId } = useParams();

  return (
    <div className="flex justify-center items-center h-full">
      <ValveSwitch key={deviceId} deviceId={deviceId} />
    </div>
  )
}

export default SwitchPage