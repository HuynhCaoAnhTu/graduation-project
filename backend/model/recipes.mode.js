const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    time: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model("Recipe", recipeSchema);
