const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt")
const {sign} = require("jsonwebtoken")

// Middlewares!
const { validateToken } = require("../middlewares/AuthMiddlewares")

// Everytime we use some thing from sequelize, we must use it Asynchoronously!

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });

    // After returning!!
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //From database!
  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    return res.json({ error: "User Doesn't Exist" });
  }

  // Checking whethere password which is database equals to the password the user has entered!
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
        return res.json({ error: "Wrong Username And Password Combination" });
    };

    const accessToken = sign({
      username: user.username,
      id: user.id
    }, "importantsecret")

    res.json({token: accessToken, username: username, id: user.id});
  });

});

router.get("/auth", validateToken ,(req, res) => {
  res.json(req.user)
})

// getting some basic info about user from the database through its id(primaryKey), but we dont want password!

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: {
      exclude: ["password"]
    },
  })

  res.json(basicInfo)
})

// Changing the password! -> The things we post from front-end must be accessed through req.body in back-end.
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  // Checking whethere password which is database equals to the password the user has entered!
  bcrypt.compare(oldPassword, user.password).then((match) => {
    if (!match) {
      return res.json({ error: "Wrong current password!" });
    } 

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        {
          where: { username: req.user.username },
        }
      );

      // After updating!!
      res.json("SUCCESS");
    });

  });
})

module.exports = router;
