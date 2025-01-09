import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import { getInitials } from "../../utills/helper";

// Danh sách các thử thách
const challengesList = [
  {
    id: "push-ups",
    title: "100 Push-ups Challenge",
    description:
      "Challenge yourself to complete push up reach your limit.",
    type: "pushups",
  },
  {
    id: "step-count",
    title: "Step Count Challenge",
    description:
      "Challenge yourself to complete push up reach your limit.",
    type: "squat",
  },
];

const ChallengesSection = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    getLeaderBoardData();
  }, []); // Empty dependency array to run only once when the component mounts

  const getLeaderBoardData = async () => {
    try {
      const response = await axiosInstance.get("/get-challenge-data");
      setLeaderboardData(response.data);
      console.log(response);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };
  if (!leaderboardData) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <section id="challenges" className="py-16 bg-gray-50">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Join Our Fitness Challenges
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Push yourself further with our fitness challenges. Compete with others
          and track your progress.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {challengesList.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              leaderboard={
                challenge.type === "pushups"
                  ? leaderboardData.pushupData
                  : challenge.type === "squat"
                  ? leaderboardData.squatData
                  : []
              }
              type={challenge.type}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Component Card của từng Challenge
const ChallengeCard = ({ title, description, leaderboard, type }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={() => navigate("/challenge-player/" + type)} // Chuyển hướng đến link
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
      >
        View Challenge
      </button>
      <Leaderboard data={leaderboard} />
    </div>
  );
};

// Component Bảng xếp hạng
const Leaderboard = ({ data }) => {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-bold text-gray-900 mb-4">Leaderboard</h4>
      <ul className="text-left space-y-4">
        {data.map((entry, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-2 border-indigo-500 bg-yellow-100"
              >
                {getInitials(entry.user.fullName)}
              </div>
              <span className="font-semibold text-gray-800">
                {index + 1}. {entry.user.fullName}
              </span>
            </div>
            <span className="font-medium text-gray-700">{entry.reps} reps</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengesSection;
