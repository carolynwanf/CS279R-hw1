// Importing express and creating an express app instance
const express = require("express");
const app = express();

// Creating dotenv instance to load environment variables from .env
const dotenv = require("dotenv");

dotenv.config();

// For working with our database
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

// Connecting to the database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  // Listening for connections on port 3000
  app.listen(3000, () => console.log("server running on port 3000"));
});

// Configuring access to the "public" folder
app.use("/static", express.static("public"));

// Configuring the use of urlencoded to extract form data
app.use(express.urlencoded({ extended: true }));

// View engine configuration
app.set("view engine", "ejs");

// Rendering todo.ejs upon a get request to the default path
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);

      res.redirect("/");
    });
  });
