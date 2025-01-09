const mongoose = require("mongoose");

const categoryRecipeSchema = new mongoose.Schema({
    categoryname: { type: String, required: true }, 
});

module.exports = mongoose.model("categoryRecipe", categoryRecipeSchema);
