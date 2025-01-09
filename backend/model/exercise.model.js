const mongoose = require('mongoose');

// Định nghĩa schema cho bài tập
const exerciseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  levels: [
    {
      level: {
        type: String,
        required: true
      },
      exercises: [
        {
          name: {
            type: String,
            required: true
          },
          gifUrl: {
            type: String,
            required: true
          },
          duration: {
            type: Number,
            required: true
          },
          reps: {
            type: Number,
            required: true
          },
          cal:{
            type: Number,
            required: true
          },
        }
      ],
      exerciseImg: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Exercise", exerciseSchema)