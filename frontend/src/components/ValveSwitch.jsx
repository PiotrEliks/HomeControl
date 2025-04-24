import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { LoaderCircle, Power, PowerOff } from 'lucide-react';
import { useValveStore } from '../store/useValveStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const ValveSwitch = () => {
  const {
    valveState,
    getValveState,
    setValveOn,
    setValveOff,
    isGettingValveState,
    isChangingValveState
  } = useValveStore();

  const { authUser, socket } = useAuthStore();
  const [state, setState] = useState(valveState);
  const [waterConsumption, setWaterConsumption] = useState(0);
  const [previousState, setPreviousState] = useState(valveState);

  useEffect(() => {
    if (!socket) return;

    const handleState = (data) => setState(data.state);
    socket.on('state', handleState);

    const handleWaterFlow = (data) => {
      if (state) {
        setWaterConsumption(data.flow);
      }
    };
    socket.on('waterFlow', handleWaterFlow);

    return () => {
      socket.off('state', handleState);
      socket.off('waterFlow', handleWaterFlow);
    };
  }, [socket, state]);

  const fetchState = useCallback(() => getValveState(), [getValveState]);
  useEffect(() => { fetchState(); }, [fetchState]);

  useEffect(() => {
    getValveState();
  }, [getValveState]);

  const toggleValve = () => {
    if (state) {
      setValveOff(authUser.fullName);
    } else {
      setValveOn(authUser.fullName);
      setWaterConsumption(0);
    }
  };

  useEffect(() => {
    if (state !== previousState) {
      setPreviousState(state);

      if (state) {
        setWaterConsumption(0);
      }
    }
  }, [state, previousState]);

  return (
    <Card className="max-w-sm mx-auto p-4 rounded-2xl shadow-md">
      <CardContent className="flex flex-col items-center space-y-4">
        <motion.svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0 }}
          animate={{ rotate: state ? 360 : -360 }}
          transition={{ type: 'tween', duration: 0.6 }}
          className="w-24 h-24"
          aria-label={`Zawór jest ${state ? 'otwarty' : 'zamknięty'}`}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={state ? '#10B981' : '#EF4444'}
            strokeWidth="2"
            fill="none"
          />
          <motion.path
            d="M8 12 L11 15 L16 9"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: state ? 1 : 0 }}
            transition={{ duration: 0.3, delay: state ? 0.3 : 0 }}
          />
          <motion.path
            d="M9 9 L15 15 M15 9 L9 15"
            stroke="#EF4444"
            strokeWidth="2"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: state ? 0 : 1 }}
            transition={{ duration: 0.3, delay: state ? 0 : 0.3 }}
          />
        </motion.svg>
        <div className="text-lg font-medium">
          {isGettingValveState ? (
            <LoaderCircle className="animate-spin text-white" />
          ) : state ? (
            <span className="flex items-center gap-1 text-green-600">
              WŁĄCZONY
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              WYŁĄCZONY
            </span>
          )}
        </div>
        {/* {waterConsumption > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            <strong>Zużycie wody: </strong>
            {waterConsumption.toFixed(2)} litra
          </div>
        )} */}
        <div className="text-sm text-gray-500 mt-2">
          <strong>Zużycie wody: </strong>
          {waterConsumption.toFixed(2)} litra
        </div>

        <Button
          onClick={toggleValve}
          disabled={isChangingValveState || isGettingValveState}
          className={`flex items-center space-x-2 px-6 py-3 ${state ? 'bg-red-500 hover:bg-red-500/70' : 'bg-green-500 hover:bg-green-500/70'}`}
        >
          {isChangingValveState ? (
            <LoaderCircle className="animate-spin" />
          ) : state ? (
            <PowerOff />
          ) : (
            <Power />
          )}
          <span>
            {isChangingValveState
              ? 'Przetwarzanie...'
              : state
              ? 'Wyłącz Zawór'
              : 'Włącz Zawór'}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValveSwitch;
