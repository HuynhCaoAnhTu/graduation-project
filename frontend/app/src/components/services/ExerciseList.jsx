import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ExerciseList = ({ exercisesData, onStart }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleStart = (levelExercises) => {
    onStart(levelExercises);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Choose Your Workout
      </h2>
      {exercisesData.map((categoryData) => (
        <div key={categoryData.category} className="mb-12">
          {/* Category Title */}
          <h3 className="text-2xl font-bold text-gray-700 mb-6">{categoryData.category}</h3>
          
          {/* Carousel */}
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            keyBoardControl
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {categoryData.levels.map((levelData) => (
              <div
                key={levelData.level}
                className="m-3 p-6 bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h4 className="text-xl font-semibold text-gray-800">{levelData.level}</h4>
                <img
                  src={levelData.exerciseImg}
                  alt={levelData.level}
                  className="w-full h-48 object-cover mt-4 rounded-md"
                />
                <button
                  onClick={() => handleStart(levelData.exercises)}
                  className="mt-6 bg-blue-600 text-white text-lg py-2 px-6 rounded-lg w-full transform transition duration-300 hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
