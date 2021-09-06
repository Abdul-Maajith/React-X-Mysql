const express = require("express")
const app = express()
const cors = require("cors")

// For decoding req.body in JSON form!
app.use(express.json());

app.use(cors());

const db = require("./models")

// Router
const postRouter = require("./routes/Posts")
app.use("/posts", postRouter)

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likeRouter = require("./routes/Likes");
app.use("/likes", likeRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
      console.log("Server running on the port:3001");
    });
})
