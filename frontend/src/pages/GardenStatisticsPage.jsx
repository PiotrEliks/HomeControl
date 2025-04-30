import React, { useEffect, useState } from 'react'
import { useValveStore } from '../store/useValveStore'
import { LoaderCircle } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'

const getDateRange = (start, end) => {
  const dates = []
  let curr = new Date(start)
  const last = new Date(end)
  while (curr <= last) {
    dates.push(curr.toISOString().slice(0, 10))
    curr.setDate(curr.getDate() + 1)
  }
  return dates
}

const formatDuration = totalSeconds => {
  const hours   = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (hours)   parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (!hours && !minutes) {
    parts.push(`${seconds}s`)
  } else if (seconds) {
    parts.push(`${seconds}s`)
  }
  return parts.join(' ')
}

const GardenStatisticsPage = () => {
  const [endDate,   setEndDate]   = useState(() => new Date().toISOString().slice(0,10))
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    return d.toISOString().slice(0,10)
  })

  const [metric,  setMetric]  = useState('flow')
  const [groupBy, setGroupBy] = useState('day')

  const {
    valveLogs,
    isGettingValveLogs,
    getValveLogs
  } = useValveStore()


  useEffect(() => {
    if (startDate && endDate) {
      getValveLogs({ startDate, endDate, metric, groupBy })
    }
  }, [startDate, endDate, metric, groupBy, getValveLogs])

  const allDates = (groupBy === 'day' && startDate && endDate)
    ? getDateRange(startDate, endDate)
    : []

  let chartData
  if (groupBy === 'day') {
    chartData = allDates.map(date => {
      const log = valveLogs.find(l => l.date === date)
      if (log) {
        return {
          x: date,
          y: metric === 'flow'
            ? Number(log.totalFlow)
            : Number(log.totalDuration)
        }
      }
      return {
        x: date,
        y: metric === 'flow' ? 0 : null
      }
    })
  } else {
    const key = groupBy === 'user' ? 'openedBy' : 'method'
    chartData = valveLogs.map(item => ({
      x: item[key],
      y: metric === 'flow'
        ? Number(item.totalFlow)
        : Number(item.totalDuration)
    }))
  }

  return (
    <div className="p-2 flex items-center justify-center flex-col">
      <span className="text-3xl font-bold mb-5">REJESTR ZDARZEŃ ZAWORU</span>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex flex-col text-sm">
          <span>Od:</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mt-1 p-1 border rounded"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span>Do:</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 p-1 border rounded"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span>Metryka:</span>
          <select
            value={metric}
            onChange={e => setMetric(e.target.value)}
            className="mt-1 p-1 border rounded"
          >
            <option value="flow">Suma przepływu (litrów)</option>
            <option value="duration">Suma czasu (sekundy)</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span>Grupuj po:</span>
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            className="mt-1 p-1 border rounded"
          >
            <option value="day">Dzień</option>
            <option value="user">Użytkownik</option>
            <option value="method">Metoda</option>
          </select>
        </label>
      </div>

      {isGettingValveLogs ? (
        <div className="flex justify-center">
          <LoaderCircle className="animate-spin text-blue-500 w-8 h-8" />
        </div>
      ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={v =>
                  metric === 'duration' ? formatDuration(v) : v
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={v =>
                metric === 'duration' ? formatDuration(v) : v
              }/>
              <Legend />
              <Bar
                dataKey="y"
                name={metric === 'flow' ? 'Zużyta woda [L]' : 'Czas'}
                fill={metric === 'flow' ? '#007BFF' : '#FFBB28'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default GardenStatisticsPage;