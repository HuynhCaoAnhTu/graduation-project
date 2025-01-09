import React, { useState, useEffect } from "react";
import axios from "axios";

const ExerciseForm = ({ onSubmit, existingData }) => {
  const [category, setCategory] = useState(existingData?.category || "");
  const [level, setLevel] = useState(existingData?.level || "Beginner");
  const [exerciseImg, setExerciseImg] = useState(existingData?.exerciseImg || "");
  const [exercises, setExercises] = useState(existingData?.exercises || []);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", gifUrl: "", duration: 0 }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category, level, exerciseImg, exercises });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{existingData ? "Edit Exercise" : "Add Exercise"}</h2>

      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </label>

      <label>
        Level:
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <label>
        Exercise Image URL:
        <input
          type="text"
          value={exerciseImg}
          onChange={(e) => setExerciseImg(e.target.value)}
          required
        />
      </label>

      <h3>Sub Exercises</h3>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Name"
            value={exercise.name}
            onChange={(e) =>
              handleExerciseChange(index, "name", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="GIF URL"
            value={exercise.gifUrl}
            onChange={(e) =>
              handleExerciseChange(index, "gifUrl", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Duration (s)"
            value={exercise.duration}
            onChange={(e) =>
              handleExerciseChange(index, "duration", e.target.value)
            }
          />
        </div>
      ))}
      <button type="button" onClick={handleAddExercise}>
        Add Sub Exercise
      </button>

      <button type="submit">{existingData ? "Update" : "Submit"}</button>
    </form>
  );
};

export default ExerciseForm;
