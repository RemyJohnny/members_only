const mongoose = require("mongoose");
const moment = require("moment");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    post_img: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: moment() },
  },
  { timestamps: true }
);

PostSchema.virtual("postedAt").get(function () {
  return moment(this.createdAt).fromNow();
});

module.exports = mongoose.model("Post", PostSchema);
