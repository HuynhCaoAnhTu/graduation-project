import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { div } from "@tensorflow/tfjs";
import axiosInstance from "../../utills/axiosInstance";
import { useMainContext } from "../../../context/UserContext";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ExerciseHistory = () => {
  const [showDetails, setShowDetails] = useState(false); // Toggle hiển thị toàn bộ bài tập
  const [dailyExercises, setDailyExercises] = useState([]);
  const [recentExercise, setRecentExercise] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [chartPeriod, setChartPeriod] = useState("weekly"); // Trạng thái để chọn biểu đồ tuần hoặc tháng
  const { userInfo } = useMainContext();
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch exercises from the backend
  const fetchExercises = async () => {
    try {
      const response = await axiosInstance.get(
        `/exercise-history/${userInfo._id}`
      );
      const exercises = response.data;

      // Lọc bài tập trong ngày hiện tại
      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
      const todayExercises = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.date)
          .toISOString()
          .split("T")[0];
        return exerciseDate === today;
      });
      if (todayExercises.length > 0) {
        setRecentExercise(todayExercises[0]); // Bài tập gần nhất
        setDailyExercises(todayExercises);
        const totalDuration = todayExercises.reduce(
          (acc, exercise) =>
            acc + exercise.exercises.reduce((sum, ex) => sum + ex.duration, 0),
          0
        );
        setTotalDuration(totalDuration); // Tổng thời gian bài tập
      } else {
        setRecentExercise(null);
        setDailyExercises([]);
      }
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };
  const fetchWeeklyExercises = async () => {
    try {
      const response = await axiosInstance.get(
        `/exercise-weekly/${userInfo._id}`
      );
      const exercises = response.data;

      const weeklyData = Array(7).fill(0);
      const weeklyCalories = Array(7).fill(0);

      const today = new Date();
      const currentDayIndex = today.getDay(); 

      exercises.forEach((exercise) => {
        const exerciseDate = new Date(exercise.date);
        const dayIndex = (exerciseDate.getDay() + 6) % 7;
        if (dayIndex <= currentDayIndex) {
          exercise.exercises.forEach((ex) => {
            weeklyData[dayIndex] += ex.duration;
            weeklyCalories[dayIndex] += ex.cal || 0;
          });
        }
      });

      setWeeklyData(weeklyData.slice(0, currentDayIndex));
      setWeeklyCalories(weeklyCalories.slice(0, currentDayIndex));
    } catch (err) {
      console.error("Error fetching weekly exercises:", err);
    }
  };

  const fetchMonthlyExercises = async () => {
    try {
      const response = await axiosInstance.get(
        `/exercise-monthly/${userInfo._id}`
      );
      const data = response.data.data;
      console.log(data);
      setMonthlyData(data);
    } catch (err) {
      console.error("Error fetching weekly exercises:", err);
    }
  };

  useEffect(() => {
    fetchExercises();
    fetchWeeklyExercises();
    fetchMonthlyExercises();
  }, []);

  //   const weeklyData = [30, 45, 50, 70, 60, 80, 100];
  //   const monthlyData = [
  //     100, 150, 180, 200, 220, 250, 280, 300, 320, 340, 360, 380,
  //   ]; // Dữ liệu cho tháng

  const weeklyChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(
      0,
      weeklyData.length
    ),
    datasets: [
      {
        label: "Weekly Intensity (Minutes)",
        data: weeklyData,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Weekly Calories",
        data: weeklyCalories,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map((data) => `Day ${data.day}`), // Các ngày trong tháng
    datasets: [
      {
        label: "Monthly Intensity (Minutes)",
        data: monthlyData.map((data) => data.duration),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Monthly Calories",
        data: monthlyData.map((data) => data.calories),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartData =
    chartPeriod === "weekly" ? weeklyChartData : monthlyChartData;

  return (
    <div className="container p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Exercise History
      </h2>

      {/* Hiển thị bài tập gần nhất */}
      {recentExercise ? (
        <div className="mb-4">
          <div className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center">
            <span>
              <strong>Recent Exercise:</strong>{" "}
              {recentExercise.exercises[0].name} -{" "}
              {recentExercise.exercises[0].duration} mins
            </span>
          </div>
          <button
            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide All Exercises" : "Show All Exercises"}
          </button>
        </div>
      ) : (
        <p className="text-center">No Exercises Today</p>
      )}

      {/* Hiển thị tất cả bài tập khi toggle */}
      {showDetails && dailyExercises.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-2">All Exercises Today</h4>
          <p>
            <strong>Total Duration:</strong> {totalDuration} s
          </p>
          <ul className="list-disc list-inside">
            {dailyExercises.map((exercise) =>
              exercise.exercises.map((ex) => (
                <li key={ex._id} className="mb-2">
                  <strong>{ex.name}</strong> - {ex.duration}s -{" "}
                  <span>{ex?.reps}</span> - <span>{ex?.cal} Calories</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Biểu đồ */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Intensity</h3>

        {/* Nút chuyển đổi giữa tuần và tháng */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              chartPeriod === "weekly"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setChartPeriod("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              chartPeriod === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setChartPeriod("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Biểu đồ */}
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default ExerciseHistory;
