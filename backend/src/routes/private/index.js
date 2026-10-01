const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const mastersController = require("../../controllers/masters.controller");
const patientController = require("../../controllers/patient.controller");
const admissionController = require("../../controllers/admission.controller");
const bedController = require("../../controllers/bed.controller");
const historyController = require("../../controllers/history.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

// Private routes (protected by authMiddleware)
router.use(authMiddleware);

// User routes
router.get("/users", userController.getAllUsers);

// Common Data routes
router.get("/priority-types", mastersController.getPriorityTypes);
router.get("/doctors", mastersController.getDoctors);
router.get("/wards", mastersController.getWards);
router.get("/bed-types", mastersController.getBedTypes);
router.get("/patients", patientController.getAllPatients);
router.get("/active-admissions", patientController.getActiveAdmissions);


// Doctor
router.get("/admission-requests/doctor", admissionController.getDoctorAdmissionRequests);
router.patch("/admission-requests/:id/status", admissionController.updateAdmissionRequestStatus);

// Staff 
router.post("/admission-requests", admissionController.createAdmissionRequest);

// Ward manager
router.get("/admission-requests/approved", admissionController.getApprovedAdmissionRequests);
router.post("/admissions/assign-bed", admissionController.assignBed);
router.post("/admissions/transfer", admissionController.transferPatient);
router.post("/admissions/discharge", admissionController.dischargePatient);
router.get("/wards/:wardId/available-beds", bedController.getAvailableBedsByWard);
router.get("/wards/:wardId/beds", bedController.getAllBedsByWard);

// History Logs (Ward Manager action since they are dealing with admissions mostly)
router.get("/history", historyController.getAllAdmissionHistory);
router.get("/history/ward-logs", historyController.getWardLogs);

module.exports = router;
