import express from 'express'
import { getDriverLocation, getOnlineDriversLocation, offlineDriver, updateDriverLocation } from '../controllers/location.controller.js'
const router = express.Router();

router.get('/online', getOnlineDriversLocation);
router.get('/:driverId', getDriverLocation);
router.post('/update', updateDriverLocation);
router.post('/offline', offlineDriver);

export default router;