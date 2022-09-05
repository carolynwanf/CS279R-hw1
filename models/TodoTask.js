const mongoose = require("mongoose");

// Schema for todo tasks
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Exporting schema for use in index.js
module.exports = mongoose.model("TodoTask", todoTaskSchema);
