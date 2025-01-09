import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      {/* Header Section */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-600">About Us</h1>
        <p className="text-gray-600 text-lg">
          Our mission is to empower you to live a healthier, happier life through fitness, nutrition, and wellness. We believe in creating a positive and supportive environment where everyone can thrive.
        </p>
      </div>

      {/* Services Section */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-3xl font-bold text-blue-600 text-center">Our Services</h2>

        {/* Workouts Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">1. Workouts</h3>
          <p className="text-gray-600">
            Explore a variety of workouts designed for all fitness levels. From strength training to yoga and cardio, we have something for everyone.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Strength Training</li>
            <li>Cardio Workouts</li>
            <li>Yoga & Meditation</li>
            <li>HIIT (High-Intensity Interval Training)</li>
            <li>Personalized Training Plans</li>
          </ul>
        </div>

        {/* Healthy Meals Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">2. Healthy Meals</h3>
          <p className="text-gray-600">
            Discover nutritious and delicious meal plans to fuel your body. Our recipes are designed to support your fitness journey and improve overall health.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Balanced Meal Plans</li>
            <li>High-Protein Recipes</li>
            <li>Vegan & Vegetarian Options</li>
            <li>Post-Workout Smoothies</li>
            <li>Step-by-step Cooking Instructions</li>
          </ul>
        </div>

        {/* Challenges Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">3. Challenges</h3>
          <p className="text-gray-600">
            Join our community challenges to stay motivated and achieve your fitness goals. Compete with friends or push yourself to new limits.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>30-Day Fitness Challenge</li>
            <li>Healthy Eating Challenge</li>
            <li>Weekly Step Challenges</li>
            <li>Mindfulness & Meditation Challenges</li>
            <li>Community Support & Rewards</li>
          </ul>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 mt-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Join Our Community</h2>
        <p className="text-gray-600 text-lg">
          Take the first step towards a healthier and happier you. Join us today and start your fitness journey!
        </p>
        <button className="mt-4 py-3 px-8 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
