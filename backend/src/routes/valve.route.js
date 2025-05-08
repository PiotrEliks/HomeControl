import express from 'express';
import {
  turnValveOn,
  turnValveOff,
  getValveStateController,
  createValveSchedule,
  getValveSchedules,
  deleteValveSchedule,
  getValveSessions,
  getValveStats
} from '../controllers/valve.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/:deviceId/on",    protectRoute, turnValveOn);
router.post("/:deviceId/off",   protectRoute, turnValveOff);
router.get ("/:deviceId/state", protectRoute, getValveStateController);

router.post   ("/:deviceId/schedule",     protectRoute, createValveSchedule);
router.get    ("/:deviceId/schedules",    protectRoute, getValveSchedules);
router.delete ("/:deviceId/schedule/:openCronJobId", protectRoute, deleteValveSchedule);

router.get("/:deviceId/session", protectRoute, getValveSessions);
router.get("/:deviceId/stats",   protectRoute, getValveStats);

export default router;
