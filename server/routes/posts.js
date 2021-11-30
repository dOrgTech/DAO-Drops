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

//reached at: localhost:5000/posts

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.get("/score/:id", getScore);
router.get("/picks/", getPicks);
router.patch("/picks/:id", updatePick);

export default router;
