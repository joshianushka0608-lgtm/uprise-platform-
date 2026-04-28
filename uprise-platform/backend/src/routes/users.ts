import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import {
  getMe,
  updateMe,
  toggleRoles,
  updateStudentId,
  getPublicProfile,
  addSkill,
  removeSkill,
} from "../controllers/userController.js";

const router = Router();

// All routes require auth
router.use(authenticate);

// Me
router.get("/me", getMe);
router.put(
  "/me",
  validate([
    body("name").optional().trim().notEmpty(),
    body("bio").optional().trim(),
    body("phone").optional().trim(),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("avatar_url").optional().isURL(),
  ]),
  updateMe
);

// Roles
router.put(
  "/roles",
  validate([
    body("roles").isArray({ min: 1 }).withMessage("At least one role required"),
    body("roles.*.role_type").isIn(["learner", "earner", "mentor"]),
    body("roles.*.active").isBoolean(),
  ]),
  toggleRoles
);

// Student ID
router.put(
  "/student-id",
  validate([body("student_id").trim().notEmpty().withMessage("Student ID required")]),
  updateStudentId
);

// Skills
router.post(
  "/skills",
  validate([
    body("skill_name").trim().notEmpty().withMessage("Skill name required"),
    body("skill_level").optional().isIn(["beginner", "intermediate", "advanced"]),
  ]),
  addSkill
);
router.delete("/skills/:skillId", removeSkill);

// Public profile (after auth middleware — just check params)
router.get("/:id", getPublicProfile);

export default router;
