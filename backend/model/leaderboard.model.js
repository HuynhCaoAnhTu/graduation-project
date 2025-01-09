const mongoose = require("mongoose");

const leaderBoard = new mongoose.Schema({
  userId: { type: String, required: true }, 
  type: { type: String, required: true },
  reps: { type: Number,required: true}, 
  createOn: { type: Date, default: new Date().getTime() }
});

module.exports = mongoose.model("LeaderBoard", leaderBoard);