import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  getScore,
  getPicks,
  updatePick
} from "../controllers/posts.js";

const router = express.Router();

//reached at: localhost:5000/submissions

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.get("/:id", getScore);
router.get("/", getPicks);
router.patch("/:id", updatePick);

export default router;
