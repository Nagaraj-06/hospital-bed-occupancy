const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");

// Public routes
router.post("/users", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
