import React, { useState, useEffect } from "react";
import CompletedExercisesForm from "./CompletedExercisesForm ";
import { toast } from "react-toastify";

const ExercisePlayer = ({ exercises, onEnd }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.duration || 0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  useEffect(() => {
    if (timeLeft === 0) return;

    // Giảm thời gian còn lại mỗi giây
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAutoNext = () => {
    const currentExercise = exercises[currentExerciseIndex];

    if (currentExerciseIndex < exercises.length - 1) {
      setCompletedExercises((prev) => [
        ...prev,
        {
          exerciseID: currentExercise._id || currentExercise.id || currentExerciseIndex.toString(),
          name: currentExercise.name,
          duration: currentExercise.duration,
          gifUrl: currentExercise.gifUrl,
          reps:currentExercise.reps,
          cal:currentExercise.cal,
        },
      ]);

      // Chuyển sang bài tập tiếp theo
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeLeft(exercises[nextIndex].duration);
    } else {
      // Nếu là bài tập cuối, gọi hàm kết thúc và hiển thị form
      setCompletedExercises((prev) => [
        ...prev,
        {
          exerciseID: currentExercise._id || currentExercise.id || currentExerciseIndex.toString(),
          name: currentExercise.name,
          duration: currentExercise.duration,
          gifUrl: currentExercise.gifUrl,
          reps:currentExercise.reps,
          cal:currentExercise.cal,
        },
      ]);
      setShowForm(true);
    }
  };

  const handleSkip = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeLeft(exercises[nextIndex].duration);
    } else {
      if (completedExercises.length === 0) {
        toast.warning("You haven't done any exercise!");
        onEnd();
      } else {
        setShowForm(true);
      }
    }
  };


  const handleExit = () => {
    setShowForm(false);
    onEnd();
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="flex flex-row gap-2">
      {!showForm ? (
        <>
          <div className="lg:w-full w-1/4 p-2 mb-6 lg:mb-0 h-[60vh] flex flex-col items-center bg-gray-100 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Next</h3>
            <div className="space-y-6 overflow-y-auto max-h-96 w-full">
              {exercises.slice(currentExerciseIndex + 1).map((exercise, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded-xl ${
                    index === 0 ? "bg-blue-100" : "bg-gray-200"
                  }`}
                >
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-20 h-20 object-contain mx-auto mb-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-full w-3/4 p-6 bg-white">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">{currentExercise.name}</h2>
            <img
              src={currentExercise.gifUrl}
              alt={currentExercise.name}
              className="mx-auto mb-6 w-72 h-72 object-contain"
            />
            <p className="text-2xl font-bold text-gray-700 mb-6">Time Left: {timeLeft}s</p>

            <div className="flex justify-center items-center gap-6 mb-6">
              <button
                onClick={handleAutoNext}
                disabled={timeLeft > 0}
                className={`${
                  timeLeft === 0
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-4 py-4 rounded-lg text-sm transition duration-200`}
              >
                {currentExerciseIndex < exercises.length - 1 ? "Next" : "Finish"}
              </button>

              <button
                onClick={handleSkip}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-4 rounded-lg text-sm transition duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        </>
      ) : (
        <CompletedExercisesForm
          completedExercises={completedExercises}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default ExercisePlayer;
