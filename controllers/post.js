const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs").promises;
const moment = require("moment");

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/posts/");
  },
  filename: function (req, file, cb) {
    /* let random = Math.random().toString().replace(".", "");
    console.log({ random: random }); */
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const MIME_TYPES = ["image/webp", "image/png", "image/jpeg", "image/svg+xml"];

function file_Filter(req, file, cb) {
  if (!MIME_TYPES.includes(file.mimetype)) {
    req.fileValidationError = "invalid file format";
    cb(null, false);
  } else cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: file_Filter });

exports.posts_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({})
    .populate("user")
    .sort({ createdAt: -1 })
    .exec();
  res.render("index", { title: "Express", posts: posts });
});

exports.post_add_get = (req, res, next) => {
  if (!req.user) {
    res.redirect("/user/log-in");
  }
  res.render("post_form", { title: "post" });
};

exports.post_add_post = [
  upload.single("post_img"),
  body("title", "Title field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Text field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const fileError = req.fileValidationError;
    if (fileError) {
      errors.push({
        type: "field",
        location: "form",
        path: "post_img",
        value: fileError,
        msg: "invalid file Format",
      });
    }

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
    });
    if (errors.length !== 0) {
      res.render("post_form", { title: "Express", post: post, errors: errors });
    } else {
      post.post_img = req.file ? req.file.filename : "";
      post.user = req.user.id;
      post.createdAt = moment();
      await post.save();
      res.redirect("/");
    }
  }),
];

exports.post_delete_get = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("user").exec();
  res.render("post_delete", { title: "Delete Post", post: post });
});

exports.post_delete_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.body.postID).exec();
  if (post.post_img) await deleteFile(`./public/images/posts/${post.post_img}`);
  await Post.findByIdAndDelete(req.body.postID);
  res.redirect("/");
});
