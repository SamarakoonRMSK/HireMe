import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createHire,
  getCompleteDriverFeedback,
  getCompleteDriverHires,
  getCompleteHires,
  getCompleteHiresByAdmin,
  getCustomerHires,
  getDriverHires,
  updateHireStatus,
  customerPendingHires,
  cancelHireByCustomer,
  driverIncomingHires,
  rejectHireByDriver,
  acceptHireByDriver,
  getRejectedHires,
  notifyCustomerComplete
} from "../controllers/hire.controller.js";

const router = express.Router();

router.post("/create/:userId/:driverId", verifyToken, createHire);
router.get("/customer-pending-hires/:customerId", verifyToken, customerPendingHires);
router.get("/getcustomerhires/:customerId", verifyToken, getCustomerHires);
router.get("/getcompletedriverhires/:driverId", verifyToken, getCompleteDriverHires);
router.get("/getcompletedriverFeedback/:driverId", verifyToken, getCompleteDriverFeedback);
router.get("/get-rejected-hires/:userId", verifyToken, getRejectedHires);
router.get('/driver-incoming-hires/:driverId', verifyToken, driverIncomingHires);
router.get("/getdriverhires/:driverId", verifyToken, getDriverHires);
router.get("/get-complete-hires/:customerId", verifyToken, getCompleteHires);
router.get("/getcompletehiresbyadmin/:adminId", verifyToken, getCompleteHiresByAdmin);
router.put('/notify-complete/:hireId/:driverId', verifyToken, notifyCustomerComplete);

router.put('/accept/:hireId/:driverId', verifyToken, acceptHireByDriver);
router.put('/reject/:hireId/:driverId', verifyToken, rejectHireByDriver);
router.put('/cancel/:hireId/:customerId', verifyToken, cancelHireByCustomer);
router.put("/update-status", verifyToken, updateHireStatus);

export default router;
