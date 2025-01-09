import React, { useEffect, useState } from "react";
import ExercisePlayer from "../components/services/ExercisePlayer";
import ExerciseList from "../components/services/ExerciseList";
import axiosInstance from "../utills/axiosInstance";

const ServicePage = () => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exercisesData, setExercisesData] = useState([]);

  // Lấy danh sách bài tập
  const fetchExercises = async () => {
    try {
      const response = await axiosInstance.get("/get-exercise");
      setExercisesData(response.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);


  const handleStart = (exercises) => {
    setSelectedExercises(exercises);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setSelectedExercises([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <div>
        {isPlaying ? (
          <ExercisePlayer exercises={selectedExercises} onEnd={handleEnd} />
        ) : (
          <ExerciseList exercisesData={exercisesData} onStart={handleStart} />
        )}
      </div>
    </div>
  );
};

export default ServicePage;
