const mongoose = require("mongoose");

const userPinnedRecipes = new mongoose.Schema({
  userId: { type: String, required: true }, // ID của user
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true }, // ID của recipe
  isPinned: { type: Boolean, default: false }, // Trạng thái pin
});

module.exports = mongoose.model("userPinnedRecipes", userPinnedRecipes);