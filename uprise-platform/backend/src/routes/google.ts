import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { googleAuth } from "../controllers/googleController.js";

const router = Router();

router.post(
  "/google",
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("google_id").notEmpty().withMessage("Google ID required"),
  ]),
  googleAuth
);

export default router;
