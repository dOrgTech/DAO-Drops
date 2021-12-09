import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  getScore,
  updateScore,
  getPicks
} from "../controllers/posts.js";

const router = express.Router();

//reached at: localhost:5000/posts

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.get("/score/:id", getScore);
router.patch("/score/:id", updateScore);
router.get("/picks/", getPicks);

export default router;
