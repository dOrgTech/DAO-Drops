import express from "express";

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
router.post("/", createPost);
router.get("/score/:id", getScore);
router.patch("/score/:id", updateScore);
router.get("/picks/", getPicks);

export default router;
