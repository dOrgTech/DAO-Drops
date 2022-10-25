import express from "express";
import validator from "express-validator";
import {
  getPosts,
  createPost,
  getScore,
  updateScore,
  getPicks
} from "../controllers/posts.js";

const router = express.Router();
const { check, validationResult } = validator;

//reached at: localhost:5000/posts

router.get("/", getPosts);
router.get("/score/:id", getScore);
router.get("/picks/", getPicks);
router.post(
  "/",
  [
    check("name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Name must have more than 5 characters"),
    check("message", "Message should be a string")
      .not()
      .isEmpty(),
    check("address", "address left blank")
      .optional()
      .trim(),
    check("link", "link left blank")
      .optional()
      .trim(),
    check("contact", "contact left blank").optional(),
    check("contactMethod", "contactMethod left blank")
      .optional()
      .trim(),
    check("image", "image left blank")
      .optional()
      .trim()
  ],
  createPost
);
router.patch(
  "/score/:id",
  [
    check("account")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Name must have more than 5 characters"),
    check("score", "address left blank")
      .isNumeric()
      .not()
      .isEmpty()
      .trim(),
    check("picks", "picks cannot be left blank")
      .isArray()
      .not()
      .isEmpty(),
    check("message", "Message should be a signed token")
      .not()
      .isEmpty()
  ],
  updateScore
);

export default router;
