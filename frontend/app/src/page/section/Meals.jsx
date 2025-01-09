import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Sample meal data
const mealsChicken = [
  { id: 1, name: 'Grilled Chicken', image: 'https://via.placeholder.com/200', calories: 350, recipe: 'Recipe for Grilled Chicken...' },
  { id: 2, name: 'Chicken Salad', image: 'https://via.placeholder.com/200', calories: 300, recipe: 'Recipe for Chicken Salad...' },
  { id: 3, name: 'Chicken Stir-fry', image: 'https://via.placeholder.com/200', calories: 400, recipe: 'Recipe for Chicken Stir-fry...' },
];

const mealsBeef = [
  { id: 4, name: 'Beef Steak', image: 'https://via.placeholder.com/200', calories: 500, recipe: 'Recipe for Beef Steak...' },
  { id: 5, name: 'Beef Burger', image: 'https://via.placeholder.com/200', calories: 600, recipe: 'Recipe for Beef Burger...' },
  { id: 6, name: 'Beef Tacos', image: 'https://via.placeholder.com/200', calories: 450, recipe: 'Recipe for Beef Tacos...' },
];

const mealsSalmon = [
  { id: 7, name: 'Grilled Salmon', image: 'https://via.placeholder.com/200', calories: 350, recipe: 'Recipe for Grilled Salmon...' },
  { id: 8, name: 'Salmon Salad', image: 'https://via.placeholder.com/200', calories: 250, recipe: 'Recipe for Salmon Salad...' },
  { id: 9, name: 'Salmon with Vegetables', image: 'https://via.placeholder.com/200', calories: 300, recipe: 'Recipe for Salmon with Vegetables...' },
];

// Carousel responsive settings
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
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

const MealCarousel = ({ meals, onMealClick }) => (
  <div className="w-full py-2">
    <Carousel
      responsive={responsive}
      infinite={false}
      autoPlay={false}
      className="carousel-container"
    >
      {meals.map((meal) => (
        <div key={meal.id} className="p-4" onClick={() => onMealClick(meal)}>
          <div className="relative overflow-hidden rounded-lg shadow-md cursor-pointer">
            <img loading="lazy" src={meal.image} alt={meal.name} className="w-full h-48 object-cover rounded-md" />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-50 text-white">
              <h3 className="text-md font-semibold">{meal.name}</h3>
              <p className="text-sm">{meal.calories} kcal</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  </div>
);

const MealTabs = () => {
  const [selectedTab, setSelectedTab] = useState('chicken'); // Default tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedMeal(null); // Reset selected meal when switching tabs
  };

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true); // Open modal on meal click
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeal(null); // Reset modal and meal when closed
  };

  return (
    <div className="container mx-auto py-8">
      {/* Introduction Section */}
      <div className="text-center mb-8 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Choose Your Meal</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-4">
          Discover a variety of delicious and nutritious meals! Browse through our selection of Chicken, Beef, and Salmon dishes, each crafted with fresh ingredients to satisfy your cravings.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          Click on any dish below to learn more about its recipe and ingredients.
        </p>
      </div>

      {/* Tab List */}
      <div className="flex flex-row gap-1 justify-center mb-2 px-2 lg:mb-6 lg:px-4">
        <button
          className={`py-3 px-3 text-sm sm:text-xl font-semibold rounded-lg transition duration-300 ${selectedTab === 'chicken' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => handleTabChange('chicken')}
        >
          Chicken
        </button>
        <button
          className={`py-3 px-3 text-sm sm:text-xl font-semibold rounded-lg transition duration-300 ${selectedTab === 'beef' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => handleTabChange('beef')}
        >
          Beef
        </button>
        <button
          className={`py-3 px-8 text-lg sm:text-xl font-semibold rounded-lg transition duration-300 ${selectedTab === 'salmon' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => handleTabChange('salmon')}
        >
          Salmon
        </button>
      </div>

      {/* Tab Panels */}
      {selectedTab === 'chicken' && <MealCarousel meals={mealsChicken} onMealClick={handleMealClick} />}
      {selectedTab === 'beef' && <MealCarousel meals={mealsBeef} onMealClick={handleMealClick} />}
      {selectedTab === 'salmon' && <MealCarousel meals={mealsSalmon} onMealClick={handleMealClick} />}

      {/* Modal */}
      {isModalOpen && selectedMeal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <h3 className="text-2xl font-semibold mb-4">{selectedMeal.name}</h3>
            <p className="text-lg mb-4">{selectedMeal.recipe}</p>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTabs;
