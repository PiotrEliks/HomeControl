import React from 'react'
import { useParams } from 'react-router-dom'
import ValveLogs from '../components/ValveLogs';

const ValveLogsPage = () => {
  const { deviceId } = useParams();

  return (
    <div>
      <ValveLogs key={deviceId} deviceId={deviceId} />
    </div>
  )
}

export default ValveLogsPage
