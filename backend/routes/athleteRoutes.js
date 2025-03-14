const express = require("express");
const {
  getAllAthletes,
  getAthlete,
  createAthlete,
  updateAthlete,
  deleteAthlete,
} = require("../controllers/athleteController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { profileImageUpload } = require("./uploadRoutes");

const router = express.Router();

// Public routes
router.get("/", getAllAthletes);
router.get("/:id", getAthlete);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo("Admin", "SuperAdmin"));

router.post("/", profileImageUpload.single("image"), createAthlete);
router.put("/:id", profileImageUpload.single("image"), updateAthlete);
router.delete("/:id", deleteAthlete);

module.exports = router;
