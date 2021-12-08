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
  const { id: _id } = req.params;
  const account = req.body;
  try {
    const score = await GetScore.findOne({"account": _id});
    if (score) {
      res.status(200).json({"score": Number(score.score)}); }
    else {
      res.status(200).json({"score": 0}); }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateScore = async (req, res) => {
  const { id: _id } = req.params;
  const accountData = req.body; // should include:
  // acoount: the eth address of the account being updated
  // score: the updated remaining score of this account
  // object array: an array of objects containing the projects this account has allocated points to as well as how many points each received
  // object ex:
  // {
  //    id: project mongo id,
  //    points: number of points this account allocated to this project
  // }

  const updateScore = await PostMessage.findByIdAndUpdate(_id, accountData, {
    new: true
  });

  res.json(updateScore);
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
  const pickData = req.body;

  const updatedPick = await Picks.findByIdAndUpdate(
    _id,
    { currentPoints: pickData },
    {
      new: true
    }
  );

  res.json(updatedPick);
};
