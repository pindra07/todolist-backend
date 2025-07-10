const express = require("express");
const { UserModel, TodoModel } = require("./db.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "helloworld@1123432434342645";
const mongoose = require("mongoose");


// If you want to store it locally download mongodb locally and expose the server-url
mongoose.connect(
  "mongodb+srv://santy:WtpAJDNJvlulBTc5@cluster0.9wfcv2a.mongodb.net/application"
);
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log("username and password are entered");
  await UserModel.create({
    username: username,
    password: password,
  });

  res.json({
    message: "SignUp completed",
  });
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await UserModel.findOne({
    username: username,
    password: password,
  });
  console.log(user);

  if (user) {
    // token generation
    const token = jwt.sign({
      id: user._id.toString(),
    }, JWT_SECRET);
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "credentials incorrect",
    });
  }
});


// Post Todos on this
app.post("/todo", auth, async function (req, res) {
  const userId = req.userId;
  const description = req.body.description;
  const done = req.body.done
  await TodoModel.create({
    description,
    done,
    userId
  })

  res.json({
    message: "To do created"
  })

});

app.get("/todos", auth, async function (req, res) {
  const userId = req.userId
  const todos = await TodoModel.find({
    userId: userId
  })

  res.json({
    todos
  })

});

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET)

  if(decodedData) {
    req.userId = decodedData.id;
    next()
  } else {
    res.status(403).json({
      message: "Incorrect credentials"
    })
  }
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


