import express from 'express';
import { turnLedOn, turnLedOff, getLedStateController } from '../controllers/led.controller.js';

const router = express.Router();

router.post("/on", turnLedOn);
router.post("/off", turnLedOff);
router.get("/state", getLedStateController);

export default router;