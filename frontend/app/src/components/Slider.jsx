import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const HeroSliderSection = () => {
  const slides = [
    {
      url: 'https://via.placeholder.com/1920x1080/ff7f7f/333333?text=Slide+1',
      caption: 'Join Us for Your Fitness Journey',
    },
    {
      url: 'https://via.placeholder.com/1920x1080/7fbfff/333333?text=Slide+2',
      caption: 'Transform Your Body, Transform Your Life',
    },
    {
      url: 'https://via.placeholder.com/1920x1080/7fff7f/333333?text=Slide+3',
      caption: 'Get Fit with Expert Trainers',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Optional: để hỗ trợ vuốt bằng chuột
  });

  return (
    <section className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${slides[currentIndex].url})` }} {...handlers}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center text-white px-6 md:px-12">
        <div className="max-w-lg md:max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {slides[currentIndex].caption}
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Join us to achieve your fitness goals with personalized training programs and expert guidance.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#get-started"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
            >
              Get Started
            </a>
            <a
              href="#learn-more"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Previous button */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded-full shadow-md hover:bg-gray-200 transition"
      >
        &#10094;
      </button>

      {/* Next button */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded-full shadow-md hover:bg-gray-200 transition"
      >
        &#10095;
      </button>
    </section>
  );
};

export default HeroSliderSection;
