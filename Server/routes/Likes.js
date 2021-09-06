const express = require("express");
const router = express.Router();
const { Likes } = require("../models");

// Middlewares!
const { validateToken } = require("../middlewares/AuthMiddlewares")

router.post("/", validateToken , async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id; 
    
    // As we don't want the user to like the single post twice, we just need to find if user have already like the post or not! if not we must unlike it -> by delete func!!
    const found = await Likes.findOne({
      where: {
        PostId: PostId,
        UserId: UserId,
      }
    })

    if(!found) {
        await Likes.create({
          PostId: PostId,
          UserId: UserId,
        });

        res.json({liked: true});
    } else {
      await Likes.destroy({
        where: {
          PostId: PostId,
          UserId: UserId,
        },
      });

      res.json({liked: false});
    }
});

module.exports = router;