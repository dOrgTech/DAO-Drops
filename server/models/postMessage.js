import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  name: String,
  message: String,
  address: String,
  link: String,
  contact: String,
  contactMethod: String,
  image: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
