import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

const ExerciseCRUD = () => {
  const [exercises, setExercises] = useState([]); // List of exercises
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    category: "",
    levels: [
      {
        level: "",
        exercises: [{ name: "", gifUrl: "", duration: "", reps: "", cal: "" }],
        exerciseImg: "",
      },
    ],
  });
  const [editingId, setEditingId] = useState(null); // Editing exercise ID

  useEffect(() => {
    fetchExercises();
  }, []);

  // Fetch exercises from the backend
  const fetchExercises = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-exercise");
      setExercises(response.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  // Handle changes in form fields
  const handleChange = (e, index = null, levelIndex = null) => {
    const { name, value } = e.target;

    if (levelIndex !== null) {
      // Update level or exercise
      const updatedLevels = [...formData.levels];
      if (index !== null) {
        updatedLevels[levelIndex].exercises[index][name] = value;
      } else {
        updatedLevels[levelIndex][name] = value;
      }
      setFormData({ ...formData, levels: updatedLevels });
    } else {
      // Update category or main field
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new level
  const addLevel = () => {
    const newLevel = {
      level: "",
      exercises: [{ name: "", gifUrl: "", duration: "", reps: "", cal: "" }],
      exerciseImg: "",
    };
    setFormData({ ...formData, levels: [...formData.levels, newLevel] });
  };

  // Remove a level
  const removeLevel = (index) => {
    const updatedLevels = formData.levels.filter((_, i) => i !== index);
    setFormData({ ...formData, levels: updatedLevels });
  };

  // Add a new exercise to a level
  const addSubExercise = (levelIndex) => {
    const updatedLevels = [...formData.levels];
    updatedLevels[levelIndex].exercises.push({
      name: "",
      gifUrl: "",
      duration: "",
      reps: "",
      cal: "",
    });
    setFormData({ ...formData, levels: updatedLevels });
  };

  // Remove an exercise from a level
  const removeSubExercise = (levelIndex, index) => {
    const updatedLevels = [...formData.levels];
    updatedLevels[levelIndex].exercises = updatedLevels[
      levelIndex
    ].exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, levels: updatedLevels });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/exercise/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8000/add-exercise", formData);
      }
      fetchExercises();
      closeModal();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Open modal for adding or editing exercise
  const openModal = (exercise = null) => {
    if (exercise) {
      setFormData({
        category: exercise.category,
        levels: exercise.levels,
      });
      setEditingId(exercise._id);
    } else {
      setFormData({
        category: "",
        levels: [
          {
            level: "",
            exercises: [
              { name: "", gifUrl: "", duration: "", reps: "", cal: "" },
            ],
            exerciseImg: "",
          },
        ],
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      category: "",
      levels: [
        {
          level: "",
          exercises: [{ name: "", gifUrl: "", duration: "",reps: "", cal: "" }],
          exerciseImg: "",
        },
      ],
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Exercise List</h1>
      <button
        onClick={() => openModal()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Exercise
      </button>
      <ul className="mt-6 space-y-4">
        {exercises.map((exercise) => (
          <li
            key={exercise._id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-lg"
          >
            <div>
              <h3 className="text-xl font-semibold">{exercise.category}</h3>
              <p className="text-gray-600">
                Levels: {exercise.levels.map((level) => level.level).join(", ")}
              </p>
            </div>
            <img
              src={exercise.levels[0].exerciseImg}
              alt="Exercise"
              className="w-20 h-20 object-cover rounded-full"
            />
            <button
              onClick={() => openModal(exercise)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg max-w-lg mx-auto h-[90%] overflow-y-scroll"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? "Edit Exercise" : "Add Exercise"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {formData.levels.map((level, levelIndex) => (
            <div key={levelIndex} className="mb-4">
              <h3 className="text-xl font-semibold mb-2">
                Level {levelIndex + 1}
              </h3>
              <input
                type="text"
                name="level"
                placeholder="Level Name"
                value={level.level}
                onChange={(e) => handleChange(e, null, levelIndex)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="exerciseImg"
                placeholder="Level Image URL"
                value={level.exerciseImg}
                onChange={(e) => handleChange(e, null, levelIndex)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <h4 className="font-medium mt-2">Exercises</h4>
              {level.exercises.map((sub, index) => (
                <div key={index} className="space-y-2 mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Sub Exercise Name"
                    value={sub.name}
                    onChange={(e) => handleChange(e, index, levelIndex)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="gifUrl"
                    placeholder="GIF URL"
                    value={sub.gifUrl}
                    onChange={(e) => handleChange(e, index, levelIndex)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duration"
                    value={sub.duration}
                    onChange={(e) => handleChange(e, index, levelIndex)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                   <input
                    type="number"
                    name="reps"
                    placeholder="Reps"
                    value={sub.reps}
                    onChange={(e) => handleChange(e, index, levelIndex)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                   <input
                    type="number"
                    name="cal"
                    placeholder="Cal"
                    value={sub.cal}
                    onChange={(e) => handleChange(e, index, levelIndex)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubExercise(levelIndex, index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove Exercise
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSubExercise(levelIndex)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Sub Exercise
              </button>
              <button
                type="button"
                onClick={() => removeLevel(levelIndex)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-2"
              >
                Remove Level
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addLevel}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Level
          </button>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editingId ? "Update Exercise" : "Add Exercise"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExerciseCRUD;
