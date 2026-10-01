const express = require("express");
const router = express.Router();

const publicRoutes = require("./public");
const privateRoutes = require("./private");

// Status check
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

// Mount routes
router.use("/public", publicRoutes);
router.use("/private", privateRoutes);

module.exports = router;
