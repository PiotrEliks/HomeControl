import React, { useEffect, useState } from 'react'
import { useValveStore } from '../store/useValveStore.js';
import { LoaderCircle, Power, PowerOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const ValveSwitch = () => {
  const { valveState, getValveState, setValveOn, setValveOff, isGettingValveState, isChangingValveState } = useValveStore();
  const { authUser } = useAuthStore();
  const [state, setState] = useState(valveState);

  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    const handleGetState = (data) => {
      setState(data.state);
      console.log(data);
    }

    socket.on("state", (data) => handleGetState(data));

    return () => {
      socket.off("state");
    }
  }, [])


  useEffect(() => {
    getValveState();
  }, [getValveState]);

  console.log(valveState, state)

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-row items-center justify-center gap-2 mb-5 text-xl">
        Aktualny stan zaworu: <span>{isGettingValveState ? <LoaderCircle className="size-5"/> : state ? <span className="flex flex-row items-center gap-1 text-green-600"><Power className="text-green-600 size-5"/> WŁĄCZONY</span> : <span className="flex flex-row items-center gap-1 text-red-800"><PowerOff className="text-red-800 size-5"/> WYŁĄCZONY</span>}</span>
      </div>
      <div className="flex flex-row justify-center items-cetner gap-2">
        <button
          className={`relative inline-block text-lg group ${state ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setValveOn(authUser.fullName)}
          disabled={isChangingValveState || state}
        >
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg">
            <span
              className={`absolute inset-0 w-full h-full px-5 py-3 rounded-lg ${
                !state ? 'bg-green-500' : 'bg-green-800'
              }`}
            ></span>
            <span
              className={`absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-green-800 ${
                !state ? 'group-hover:-rotate-180 ease' : ''
              }`}
            ></span>
            <span className="relative">Włącz</span>
          </span>
          <span
            className={`absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-green-800 rounded-lg ${
              !state ? 'group-hover:mb-0 group-hover:mr-0' : ''
            }`}
            data-rounded="rounded-lg"
          ></span>
        </button>
        <button
          className={`relative inline-block text-lg group ${!state ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setValveOff(authUser.fullName)}
          disabled={isChangingValveState || !state}
        >
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-white transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg">
            <span
              className={`absolute inset-0 w-full h-full px-5 py-3 rounded-lg ${
                state ? 'bg-red-500' : 'bg-red-800'
              }`}
            ></span>
            <span
              className={`absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-800 ${
                state ? 'group-hover:-rotate-180 ease' : ''
              }`}
            ></span>
            <span className="relative">Wyłącz</span>
          </span>
          <span
            className={`absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-red-800 rounded-lg ${
              state ? 'group-hover:mb-0 group-hover:mr-0' : ''
            }`}
            data-rounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  )
}

export default ValveSwitch