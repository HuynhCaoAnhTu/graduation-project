const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseHistorySchema = new Schema({
    userId: { type: String, require: true },
    date: {
        type: Date,
        required: true,
    },
    exercises: [
        {
            exerciseID: String,
            name: String,
            duration: Number,
            gifUrl: String,
            reps: Number,
            cal:Number,

        }
    ]
});

module.exports = mongoose.model("ExerHistory", ExerciseHistorySchema)