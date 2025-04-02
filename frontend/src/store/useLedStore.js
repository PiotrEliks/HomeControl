import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useLedStore = create((set, get) => ({
  ledState: false,
  isChangingLedState: false,
  isGettingLedState: false,
  isCreatingLedSchedule: false,
  isDeletingLedSchedule: false,
  isGettingLedSchedule: false,
  schedules: [],

  getLedState: async () => {
    set({ isGettingLedState: true });
    try {
      const res = await axiosInstance.get("/led/state");
      set({ ledState: res.data.led });
    } catch (error) {
      console.error("Error in getLedState: ", error);
    } finally {
      set({ isGettingLedState: false });
    }
  },

  setLedOn: async () => {
    set({ isChangingLedState: true });
    try {
      const res = await axiosInstance.post("/led/on");
      set({ ledState: res.data.led });
      toast.success("Włączono LED");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isChangingLedState: false });
    }
  },

  setLedOff: async () => {
    set({ isChangingLedState: true });
    try {
      const res = await axiosInstance.post("/led/off");
      set({ ledState: res.data.led });
      toast.success("Wyłączono LED");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isChangingLedState: false });
    }
  },

  createLedSchedule: async () => {
    set({ isCreatingLedSchedule: true });
    try {
      const res = await axiosInstance.post("/led/schedule");
      set({ schedules: res.data });
      toast.success("Ustawiono harmonogram");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isCreatingLedSchedule: false });
    }
  },

  deleteLedSchedule: async (cronJobId) => {
    set({ isDeletingLedSchedule: true });
    try {
      const res = await axiosInstance.delete(`/led/schedule/${cronJobId}`);
      set({ schedules: res.data });
      toast.success("Usunięto harmonogram");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isDeletingLedSchedule: false });
    }
  },

  getLedSchedules: async () => {
    set({ isGettingLedSchedule: true });
    try {
      const res = await axiosInstance.get("/led/schedules");
      set({ schedules: res.data });
      toast.success("Pobrano harmonogramy");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isGettingLedSchedule: false });
    }
  },

}));