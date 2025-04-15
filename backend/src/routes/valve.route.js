import express from 'express';
import { turnValveOn, turnValveOff, getValveStateController, createValveSchedule, getValveSchedules, deleteValveSchedule } from '../controllers/valve.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/on", protectRoute, turnValveOn);
router.post("/off", protectRoute, turnValveOff);
router.get("/state", protectRoute, getValveStateController);
router.post("/schedule", protectRoute, createValveSchedule);
router.get("/schedules", protectRoute, getValveSchedules);
router.delete("/schedule/:openCronJobId", protectRoute, deleteValveSchedule);

export default router;