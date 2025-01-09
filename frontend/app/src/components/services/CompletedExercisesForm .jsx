import React, { useEffect, useState } from "react";
import axiosInstance from "../../utills/axiosInstance";
import { useMainContext } from "../../../context/UserContext";
import { toast } from "react-toastify";

const CompletedExercisesForm = ({ completedExercises, onExit }) => {
  const [formDate, setFormDate] = useState("");
  const { userInfo } = useMainContext();
  useEffect(() => {
    // Lấy ngày hiện tại từ đối tượng Date và chuyển về định dạng YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0];
    setFormDate(currentDate);
  }, []);

  const handleFormSubmit = async () => {
    if (!formDate) {
      toast.error("Please select a date.");
      return;
    }

    // Replace with actual userID (you can pass it as a prop or get it from auth context)

    const formData = {
      userId: userInfo._id,
      date: new Date(formDate).toISOString(),
      exercises: completedExercises.map((exercise) => ({
        exerciseID: exercise.exerciseID,
        name: exercise.name,
        duration: exercise.duration,
        gifUrl: exercise.gifUrl,
        reps: exercise.reps,
        cal: exercise.cal,
      })),
    };

    try {
      const response = await axiosInstance.post(
        "/add-exercise-history",
        formData
      );

      toast.success(
        response.data.message || "Exercise history saved successfully!"
      );
      onExit();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-4">
          Completed Exercises
        </h3>

        <div className="mb-4">
          <label htmlFor="date" className="block text-lg">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full px-4 py-2 border rounded-lg"
            value={formDate}
            disabled="true"
            onChange={(e) => setFormDate(e.target.value)}
          />
        </div>

        <h4 className="text-lg font-semibold mb-4">Exercises Completed:</h4>
        <ul className="list-disc list-inside text-lg mb-4">
          {completedExercises.map((exercise, index) => (
            <li key={index}>
              {exercise.name} - RepS:{exercise.reps}  {exercise.duration}s - Cal: {exercise.cal}
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleFormSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>

          <button
            onClick={onExit}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedExercisesForm;
