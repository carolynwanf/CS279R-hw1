// Importing express and creating an express app instance
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

// Configuring access to the "public" folder
app.use("/static", express.static("public"));

// Configuring the use of urlencoded to extract form data
app.use(express.urlencoded({ extended: true }));

// View engine configuration
app.set("view engine", "ejs");

// Rendering todo.ejs upon a get request to the default path
app.get("/", (req, res) => {
  res.render("todo.ejs");
});

//
app.post("/", (req, res) => {
  console.log(req.body);
});

// Listening for connections on port 3000
app.listen(3000, () => console.log("server running on port 3000"));
