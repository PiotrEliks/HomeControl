import React from 'react'
import { useParams } from 'react-router-dom'
import ValveCharts from '../components/ValveCharts.jsx'

const GardenStatisticsPage = () => {
    const { deviceId } = useParams();
    return (
        <div>
            <ValveCharts key={deviceId} deviceId={deviceId} />
        </div>
    )
}

export default GardenStatisticsPage