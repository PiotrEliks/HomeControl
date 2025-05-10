import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useValveStore = create((set, get) => ({
  valveState: false,
  isChangingValveState: false,
  isGettingValveState: false,

  schedules: [],
  isCreatingValveSchedule: false,
  isDeletingValveSchedule: false,
  isGettingValveSchedule: false,

  valveSessions: [],
  sessionsMeta: { total: 0, page: 1, perPage: 20, totalPages: 1 },
  isGettingValveSessions: false,

  valveLogs: [],
  isGettingValveLogs: false,

  getValveLogs: async ({ startDate, endDate, metric, groupBy, deviceId }) => {
    set({ isGettingValveLogs: true });
    try {
      const res = await axiosInstance.get(`/devices/${deviceId}/stats`, {
        params: { startDate, endDate, metric, groupBy }
      });
      set({ valveLogs: res.data.data });
    } catch (err) {
      console.error('Error fetching valve logs:', err);
      toast.error(err.response?.data?.error || 'Błąd przy pobieraniu statystyk');
    } finally {
      set({ isGettingValveLogs: false });
    }
  },

  getValveSessions: async (params = {}, deviceId) => {
    set({ isGettingValveSessions: true });
    try {
      const res = await axiosInstance.get(`/devices/${deviceId}/session`, { params });
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

  getValveState: async (deviceId) => {
    set({ isGettingValveState: true });
    try {
      const res = await axiosInstance.get(`/devices/${deviceId}/state`);
      set({ valveState: res.data.valve });
    } catch (error) {
      console.error('Error in getValveState:', error);
      toast.error(error.response?.data?.error || 'Błąd przy pobieraniu stanu zaworu');
    } finally {
      set({ isGettingValveState: false });
    }
  },

  setValveOn: async (fullName, deviceId) => {
    set({ isChangingValveState: true });
    try {
      const res = await axiosInstance.post(`/devices/${deviceId}/on`, { fullName });
      set({ valveState: res.data.valve });
      toast.success('Włączono zawór');
    } catch (error) {
      console.error('Error setting valve on:', error);
      toast.error(error.response?.data?.error || 'Błąd przy włączaniu zaworu');
    } finally {
      set({ isChangingValveState: false });
    }
  },

  setValveOff: async (fullName, deviceId) => {
    set({ isChangingValveState: true });
    try {
      const res = await axiosInstance.post(`/devices/${deviceId}/off`, { fullName });
      set({ valveState: res.data.valve });
      toast.success('Wyłączono zawór');
    } catch (error) {
      console.error('Error setting valve off:', error);
      toast.error(error.response?.data?.error || 'Błąd przy wyłączaniu zaworu');
    } finally {
      set({ isChangingValveState: false });
    }
  },

  getValveSchedules: async (deviceId) => {
    set({ isGettingValveSchedule: true });
    try {
      const res = await axiosInstance.get(`/devices/${deviceId}/schedules`);
      set({ schedules: res.data });
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error(error.response?.data?.error || 'Błąd przy pobieraniu harmonogramów');
    } finally {
      set({ isGettingValveSchedule: false });
    }
  },

  createValveSchedule: async (days, openHour, openMinute, closeHour, closeMinute, createdBy, deviceId) => {
    set({ isCreatingValveSchedule: true });
    try {
      const res = await axiosInstance.post(`/devices/${deviceId}/schedule`, {
        days,
        openHour,
        openMinute,
        closeHour,
        closeMinute,
        createdBy
      });
      set({ schedules: res.data });
      toast.success('Ustawiono harmonogram');
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error(error.response?.data?.error || 'Błąd przy tworzeniu harmonogramu');
    } finally {
      set({ isCreatingValveSchedule: false });
    }
  },

  deleteValveSchedule: async (openCronJobId, deviceId) => {
    set({ isDeletingValveSchedule: true });
    try {
      const res = await axiosInstance.delete(`/devices/${deviceId}/schedule/${openCronJobId}`);
      set({ schedules: res.data });
      toast.success('Usunięto harmonogram');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error(error.response?.data?.error || 'Błąd przy usuwaniu harmonogramu');
    } finally {
      set({ isDeletingValveSchedule: false });
    }
  },
}));
