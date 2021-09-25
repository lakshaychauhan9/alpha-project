import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    caption: String,
    username: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("posts", instance);
