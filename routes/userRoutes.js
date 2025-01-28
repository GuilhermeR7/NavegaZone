const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.upload.single("photo"), userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", userController.getProfile);
router.post("/logout", userController.logoutUser);

module.exports = router;
