import React, { useEffect } from 'react'
import { useLedStore } from '../store/useLedStore.js';
import { LoaderCircle } from 'lucide-react';

const LedSwitch = () => {
  const { ledState, getLedState, setLedOn, setLedOff, isGettingLedState, isChangingLedState } = useLedStore();

  useEffect(() => {
    getLedState();
  }, [getLedState]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-row items-center justify-center gap-2 mb-5 text-xl">
        Aktualny stan LED: <span className="font-bold">{isGettingLedState ? <LoaderCircle className="size-5"/> : ledState ? 'WŁĄCZONY' : 'WYŁĄCZONY'}</span>
      </div>
      <div className="flex flex-row justify-center items-cetner gap-2">
        <button
          className={`relative inline-block text-lg group ${ledState ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setLedOn()}
          disabled={isChangingLedState || ledState}
        >
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg">
            <span
              className={`absolute inset-0 w-full h-full px-5 py-3 rounded-lg ${
                !ledState ? 'bg-green-500' : 'bg-green-800'
              }`}
            ></span>
            <span
              className={`absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-green-800 ${
                !ledState ? 'group-hover:-rotate-180 ease' : ''
              }`}
            ></span>
            <span className="relative">Włącz</span>
          </span>
          <span
            className={`absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-green-800 rounded-lg ${
              !ledState ? 'group-hover:mb-0 group-hover:mr-0' : ''
            }`}
            data-rounded="rounded-lg"
          ></span>
        </button>
        <button
          className={`relative inline-block text-lg group ${!ledState ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setLedOff()}
          disabled={isChangingLedState || !ledState}
        >
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg">
            <span
              className={`absolute inset-0 w-full h-full px-5 py-3 rounded-lg ${
                ledState ? 'bg-red-500' : 'bg-red-800'
              }`}
            ></span>
            <span
              className={`absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-800 ${
                ledState ? 'group-hover:-rotate-180 ease' : ''
              }`}
            ></span>
            <span className="relative">Wyłącz</span>
          </span>
          <span
            className={`absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-red-800 rounded-lg ${
              ledState ? 'group-hover:mb-0 group-hover:mr-0' : ''
            }`}
            data-rounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  )
}

export default LedSwitch