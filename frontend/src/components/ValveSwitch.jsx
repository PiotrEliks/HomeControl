import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { LoaderCircle, Power, PowerOff } from 'lucide-react';
import { useValveStore } from '../store/useValveStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const ValveSwitch = ({ deviceId }) => {
  const {
    valveState: state,
    getValveState,
    setValveOn,
    setValveOff,
    isGettingValveState,
    isChangingValveState
  } = useValveStore();

  const { authUser, socket } = useAuthStore();
  const [waterConsumption, setWaterConsumption] = useState(0);

  useEffect(() => {
    getValveState(deviceId);
  }, [getValveState, deviceId]);

  useEffect(() => {
    if (!socket) return;
    const handleState = ({ deviceId: id, state, extra }) => {
      console.log('Socket state update:', { id, state, extra });
      if (id !== deviceId) return;
      useValveStore.setState({ valveState: {state, extra } });
      const valveState = useValveStore.getState().valveState;
      console.log(valveState)
      if (extra?.waterFlow != null) {
        setWaterConsumption(extra.waterFlow);
      }
    };
    socket.on('state', handleState);
    return () => {
      socket.off('state', handleState);
    };
  }, [socket, deviceId]);

  const toggleValve = () => {
    if (state.state) {
      setValveOff(authUser.fullName, deviceId);
    } else {
      setWaterConsumption(0);
      setValveOn(authUser.fullName, deviceId);
    }
  };

  function getLitrForm(n) {
    if (!Number.isInteger(n)) return 'litra';
    const abs = Math.abs(n), mod100 = abs % 100, mod10 = abs % 10;
    if (mod100 >= 12 && mod100 <= 14) return 'litrów';
    if (mod10 === 1) return 'litr';
    if (mod10 >= 2 && mod10 <= 4) return 'litry';
    return 'litrów';
  }
  function formatNumber(v) {
    const f = v.toFixed(2);
    return `${f.endsWith('.00') ? Math.trunc(v) : f} ${getLitrForm(v)}`;
  }

  console.log(state)

  if ((state.state === undefined || state.state === null || state.state === 'unknown') && !isChangingValveState) {
    console.log(state)
    console.log(state.state, isChangingValveState)
    return (
      <Card className="max-w-sm mx-auto p-4 rounded-2xl shadow-md">
        <CardContent className="flex flex-col items-center space-y-4">
          <PowerOff className="text-red-500 size-20"/>
          <div className="text-lg font-medium">Urządzenie nie podłączone</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm mx-auto p-4 rounded-2xl shadow-md">
      <CardContent className="flex flex-col items-center space-y-4">
        <motion.svg
          width="96" height="96" viewBox="0 0 24 24"
          initial={{ rotate: 0 }}
          animate={{ rotate: state.state ? 360 : -360 }}
          transition={{ type: 'tween', duration: 0.6 }}
        >
          <circle
            cx="12" cy="12" r="10"
            stroke={state.state ? '#10B981' : '#EF4444'}
            strokeWidth="2" fill="none"
          />
          <motion.path
            d="M8 12 L11 15 L16 9"
            stroke="#10B981" strokeWidth="2" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: state.state ? 1 : 0 }}
            transition={{ duration: 0.3, delay: state.state ? 0.3 : 0 }}
          />
          <motion.path
            d="M9 9 L15 15 M15 9 L9 15"
            stroke="#EF4444" strokeWidth="2" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: state.state ? 0 : 1 }}
            transition={{ duration: 0.3, delay: state.state ? 0 : 0.3 }}
          />
        </motion.svg>

        <div className="text-lg font-medium">
          {isGettingValveState
            ? <LoaderCircle className="animate-spin text-white" />
            : state.state
              ? <span className="text-green-600">WŁĄCZONY</span>
              : <span className="text-red-600">WYŁĄCZONY</span>
          }
        </div>

        <div className="text-sm text-gray-500 mt-2">
          <strong>Zużycie wody: </strong>
          {formatNumber(waterConsumption)}
        </div>

        <Button
          onClick={toggleValve}
          disabled={isChangingValveState || isGettingValveState}
          className={`flex items-center space-x-2 px-6 py-3 ${
            state.state ? 'bg-red-500 hover:bg-red-500/70' : 'bg-green-500 hover:bg-green-500/70'
          }`}
        > 
          {isChangingValveState
            ? <LoaderCircle className="animate-spin" />
            : state.state
              ? <PowerOff />
              : <Power />
          }
          <span>
            {isChangingValveState
              ? 'Przetwarzanie...'
              : state.state
                ? 'Wyłącz Zawór'
                : 'Włącz Zawór'
            }
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValveSwitch;
