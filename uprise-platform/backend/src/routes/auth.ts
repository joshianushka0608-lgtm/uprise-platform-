import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { register, login, logout, refreshToken } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  validate([
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
  ]),
  register
);

router.post(
  "/login",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

router.post("/logout", authenticate, logout);
router.post("/refresh", authenticate, refreshToken);

export default router;
