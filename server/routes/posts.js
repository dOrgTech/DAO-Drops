import express from "express";
import check from "express-validator";

import {
  getPosts,
  createPost,
  getScore,
  updateScore,
  getPicks
} from "../controllers/posts.js";

const router = express.Router();

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
      .isLength({ min: 5 })
      .trim()
      .escape()
      .withMessage("Name must have more than 5 characters"),
    check("message", "Message should be a string")
      .not()
      .isEmpty(),
    check("address", "address left blank")
      .optional()
      .trim()
      .escape(),
    check("link", "link left blank")
      .optional()
      .trim()
      .escape(),
    check("contact", "contact left blank").optional(),
    check("contactMethod", "contactMethod left blank")
      .optional()
      .trim()
      .escape(),
    check("image", "image left blank")
      .optional()
      .trim()
      .escape()
  ],
  createPost
);
router.patch(
  "/score/:id",
  [
    check("account")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .trim()
      .escape()
      .withMessage("Name must have more than 5 characters"),
    check("score", "address left blank")
      .isNumeric()
      .not()
      .isEmpty()
      .trim()
      .escape(),
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
