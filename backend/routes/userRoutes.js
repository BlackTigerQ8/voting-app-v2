const express = require("express");
const {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  contactMessage,
  checkEmailExists,
  checkPhoneExists,
  checkIdNumberExists,
  initiateRegistration,
  verifyOTPAndRegister,
  deleteTempUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { profileImageUpload } = require("./uploadRoutes");

const router = express.Router();

// Public routes (no authentication needed)
router.post("/login", loginUser);
router.post("/contact", contactMessage);
router.post("/", profileImageUpload.single("idImage"), createUser);
router.get("/check-email/:email", checkEmailExists);
router.get("/check-phone/:phone", checkPhoneExists);
router.get("/check-id/:idNumber", checkIdNumberExists);
router.post(
  "/initiate-registration",
  profileImageUpload.single("idImage"),
  initiateRegistration
);
router.post("/verify-otp", verifyOTPAndRegister);
router.delete("/temp/:id", deleteTempUser);
// Protected routes (authentication needed)
router.get("/", protect, getAllusers);
router.post("/logout", protect, logoutUser);

router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, profileImageUpload.single("idImage"), updateUser)
  .delete(protect, restrictTo("Admin", "SuperAdmin"), deleteUser);

module.exports = router;
