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

  valveSessions: [],
  sessionsMeta: { total: 0, page: 1, perPage: 20, totalPages: 1 },
  isGettingValveSessions: false,

  valveLogs: [],
  isGettingValveLogs: false,

  /**
   * Pobiera zagregowane logi zaworu:
   * @param {object} params { startDate, endDate, metric, groupBy }
   */
  getValveLogs: async ({ startDate, endDate, metric, groupBy }) => {
    set({ isGettingValveLogs: true })
    try {
      const res = await axiosInstance.get('/valve/stats', {
        params: { startDate, endDate, metric, groupBy }
      })
      // oczekujemy: res.data.data = [{ date/user/method/schedule, totalFlow|totalDuration }, …]
      set({ valveLogs: res.data.data })
    } catch (err) {
      console.error('Error fetching valve logs:', err)
      toast.error(err.response?.data?.error || 'Błąd przy pobieraniu statystyk')
    } finally {
      set({ isGettingValveLogs: false })
    }
  },

  /**
   * Pobiera listę sesji z paginacją, filtrowaniem i sortowaniem.
   * @param {object} params { openDate, closeDate, openedBy, closedBy, method, sortBy, sortOrder, limit, page }
   */
  getValveSessions: async (params = {}) => {
    set({ isGettingValveSessions: true });
    try {
      const res = await axiosInstance.get('/valve/session', { params });
      set({
        valveSessions: res.data.sessions,
        sessionsMeta: res.data.meta
      });
    } catch (error) {
      console.error('Error fetching valve sessions:', error);
      toast.error(error.response?.data?.error || 'Błąd przy pobieraniu sesji zaworu');
    } finally {
      set({ isGettingValveSessions: false });
    }
  },

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
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isGettingValveSchedule: false });
    }
  },

}));