const express = require("express")
const router = express.Router()
const { Posts, Likes } = require("../models")

// Everytime we use some thing from sequelize, we must use it Asynchoronously!

// Middlewares!
const { validateToken } = require("../middlewares/AuthMiddlewares")

// Here, we are merging two tables Posts and likes as we need how many like does each post has!!

router.get("/", validateToken ,async (req, res) => {
   const listOfPosts = await Posts.findAll({include: [Likes]});
   
   // checking whether the post has liked by the user or not, and sent the response!
   const likedPosts = await Likes.findAll({where: { UserId: req.user.id }})

   res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
})

router.get("/byId/:id", async (req, res) => {
   const id = req.params.id;
   const post = await Posts.findByPk(id);
   res.json(post);
})

router.post("/",validateToken ,async (req, res) => {
  const post = req.body;

  // Here, we are accessing username from the token.via the headers
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);

  // After posting return =>
  res.json(post);
})

// to edit the title!
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({title: newTitle}, {
    where: { id: id }
  });
  res.json(newTitle);
});

// to edit the body!
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update(
    { postText: newText },
    {
      where: { id: id },
    }
  );
  res.json(newText);
});

router.delete("/:postId",validateToken, async (req, res) => {
   const postId = req.params.postId;
   await Posts.destroy({
     where: {
       id: postId,
     },
   });

   res.json("Deleted successfully!");
})

// In order to show the post which is created by that particular user in profile section!
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({ 
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

module.exports = router;