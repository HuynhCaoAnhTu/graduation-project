const mongoose = require("mongoose");

const recipeCategorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    createOn: { type: Date, default: new Date().getTime() }
});

module.exports = mongoose.model("recipeCategory", recipeCategorySchema);
