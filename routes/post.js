const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

/* Posts routes */
router.get("/", postController.posts_get);

router.get("/add", postController.post_add_get);

router.post("/add", postController.post_add_post);

router.get("/:id/delete", postController.post_delete_get);

router.post("/:id/delete", postController.post_delete_post);

module.exports = router;
