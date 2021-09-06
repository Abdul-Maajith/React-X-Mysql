const express = require("express");
const router = express.Router();
const { Comments } = require("../models");

// Middleware
const { validateToken } = require("../middlewares/AuthMiddlewares")

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({
      where: {PostId: postId}
  });
  res.json(comments);
});

// we can pass the middleware in between the headers and functions!
router.post("/", validateToken ,async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({where: {
    id: commentId,
  }});

  res.json("Deleted successfully!")
})

module.exports = router;