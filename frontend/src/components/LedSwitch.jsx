import React, { useEffect } from 'react'
import { useLedStore } from '../store/useLedStore.js';
import { LoaderCircle } from 'lucide-react';

const LedSwitch = () => {
  const { ledState, getLedState, setLedOn, setLedOff, isGettingLedState, isChangingLedState } = useLedStore();

  useEffect(() => {
    getLedState();
  }, [getLedState, setLedOn, setLedOff]);

  console.log(ledState)

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        Stan: {isGettingLedState ? <LoaderCircle /> : ledState ? 'LED włączony' : 'LED wyłączony'} {console.log(ledState)}
      </div>
      <div className="flex flex-row justify-center items-cetner gap-2">
        <button className="bg-green-800 text-white p-2 rounded-xl cursor-pointer hover:bg-green-800/80" onClick={() => {setLedOn()}} disabled={isChangingLedState || ledState}>
          On
        </button>
        <button className="bg-red-800 text-white p-2 rounded-xl cursor-pointer hover:bg-red-800/80" onClick={() => {setLedOff()}} disabled={isChangingLedState || !ledState}>
          Off
        </button>
      </div>
    </div>
  )
}

export default LedSwitch