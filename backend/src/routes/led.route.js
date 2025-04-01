import express from 'express';
import { turnLedOn, turnLedOff, getLedStateController, createLedSchedule, getLedSchedules, deleteLedSchedule } from '../controllers/led.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/on", protectRoute, turnLedOn);
router.post("/off", protectRoute, turnLedOff);
router.get("/state", protectRoute, getLedStateController);
router.post("/schedule", protectRoute, createLedSchedule);
router.get("/schedules", protectRoute, getLedSchedules);
router.delete("/schedule", protectRoute, deleteLedSchedule);

export default router;