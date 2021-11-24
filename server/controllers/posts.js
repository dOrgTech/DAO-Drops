import PostMessage from "../models/postMessage.js";
import GetScore from "../models/scores.js";
import Picks from "../models/picks.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const body = req.body;

  const newPost = new PostMessage(body);

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true
  });

  res.json(updatePost);
};

export const getScore = async (req, res) => {
  const account = req.body;
  try {
    const score = await PostMessage.find(account);
    res.status(200).json(score);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPicks = async (req, res) => {
  try {
    const picks = await Picks.find();
    res.status(200).json(picks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePick = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  const updatePick = await Picks.findByIdAndUpdate(_id, post, {
    new: true
  });

  res.json(updatePick);
};
