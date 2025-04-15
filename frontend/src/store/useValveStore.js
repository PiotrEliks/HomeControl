import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useValveStore = create((set, get) => ({
  valveState: false,
  isChangingValveState: false,
  isGettingValveState: false,
  isCreatingValveSchedule: false,
  isDeletingValveSchedule: false,
  isGettingValveSchedule: false,
  schedules: [],

  getValveState: async () => {
    set({ isGettingValveState: true });
    try {
      const res = await axiosInstance.get("/valve/state");
      set({ valveState: res.data.valve });
    } catch (error) {
      console.error("Error in getValveState: ", error);
    } finally {
      set({ isGettingValveState: false });
    }
  },

  setValveOn: async (fullName) => {
    set({ isChangingValveState: true });
    try {
      const res = await axiosInstance.post("/valve/on", { fullName });
      set({ valveState: res.data.valve });
      toast.success("Włączono zawór");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isChangingValveState: false });
    }
  },

  setValveOff: async (fullName) => {
    set({ isChangingValveState: true });
    try {
      const res = await axiosInstance.post("/valve/off", { fullName });
      set({ valveState: res.data.valve });
      toast.success("Wyłączono zawór");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isChangingValveState: false });
    }
  },

  createValveSchedule: async (days, openHour, openMinute, closeHour, closeMinute, createdBy) => {
    set({ isCreatingValveSchedule: true });
    try {
      const res = await axiosInstance.post("/valve/schedule", {
        days,
        openHour,
        openMinute,
        closeHour,
        closeMinute,
        createdBy
      });
      set({ schedules: res.data });
      toast.success("Ustawiono harmonogram");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isCreatingValveSchedule: false });
    }
  },

  deleteValveSchedule: async (openCronJobId) => {
    set({ isDeletingValveSchedule: true });
    try {
      const res = await axiosInstance.delete(`/valve/schedule/${openCronJobId}`);
      set({ schedules: res.data });
      toast.success("Usunięto harmonogram");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isDeletingValveSchedule: false });
    }
  },

  getValveSchedules: async () => {
    set({ isGettingValveSchedule: true });
    try {
      const res = await axiosInstance.get("/valve/schedules");
      set({ schedules: res.data });
      toast.success("Pobrano harmonogramy");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isGettingValveSchedule: false });
    }
  },

}));