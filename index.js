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
  // Listening for connections on port
  var port = process.env.PORT || 3000;
  app.listen(port, () => console.log("server running on port", port));
});

console.log("configuring the app");

// Configuring access to the "public" folder
app.use("/static", express.static("public"));

// Configuring the use of urlencoded to extract form data
app.use(express.urlencoded({ extended: true }));

// View engine configuration
app.set("view engine", "ejs");

// Rendering todo.ejs upon a get request to the default path
app.get("/", (req, res) => {
  console.log("finding tasks");
  TodoTask.find({}, (err, tasks) => {
    console.log("rendering");
    res.render("todo.ejs", { todoTasks: tasks });
    console.log("done rendering");
  });
});

console.log("done loading the default page");

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

// Logic for editing todos
app
  .route("/edit/:id")
  .get((req, res) => {
    // Rendering the edit view of the page when edit process is initiated
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    // Updating the database with the changes submitted
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);

      res.redirect("/"); // Redirecting the page back to the default view
    });
  });

// Logic for deleting todos
app.route("/remove/:id").get((req, res) => {
  // Removing the task from the database
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    // Redirecting the page back to the default view
    res.redirect("/");
  });
});
