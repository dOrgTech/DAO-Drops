import express from "express";

import { getPosts, createPost, updatePost } from "../controllers/posts.js";

const router = express.Router();

//reached at: localhost:5000/submissions

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);

export default router;
