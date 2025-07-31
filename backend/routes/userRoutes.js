const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth"); // ✅ must point to correct file

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/validate", auth, userController.validateUser); // ✅ this line works now

router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOtp);
router.post("/reset-password", userController.resetPassword);

module.exports = router;