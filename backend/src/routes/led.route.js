import express from 'express';
import { turnLedOn, turnLedOff, getLedStateController } from '../controllers/led.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/on", protectRoute, turnLedOn);
router.post("/off", protectRoute, turnLedOff);
router.get("/state", protectRoute, getLedStateController);

export default router;