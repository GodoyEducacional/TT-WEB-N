const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const validateRequest = require("../middlewares/validationMiddleware");
const { registerSchema, loginSchema } = require("../validators/userValidator");

router.post("/register", validateRequest(registerSchema), registerUser);

router.login("/login", validateRequest(loginSchema), loginUser);

module.exports = router;
