import React from 'react';

const HeroSection = () => {
  return (
    <section 
      className="relative w-full h-[70vh] lg:h-[75vh] lg:mt-0 mt-[56px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://png.pngtree.com/thumb_back/fh260/background/20230519/pngtree-an-old-gym-setting-with-dumbbells-image_2569910.jpg)',
      }}
    >
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center text-white px-6 md:px-12">
        <div className="max-w-lg md:max-w-2xl">
          {/* <h1 className="text-3xl  font-extrabold mb-4">
            Achieve Your Fitness Goals with Us
          </h1> */}
          <p className="text-base sm:text-lg md:text-xl mb-6">
            Get personalized fitness plans, expert trainers, and the motivation you need to reach your goals.
          </p>
          <div className="flex flex-row sm:flex-row justify-center items-center gap-4">
            <a
              href="#get-started"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm lg:px-7 lg:py-3 lg:text-lg rounded-lg shadow-md transition duration-300  "
            >
              Get Started
            </a>
            <a
              href="#learn-more"
              className="bg-transparent border-2 border-white text-white px-5 py-2 text-sm lg:px-7 lg:py-3 lg:text-lg rounded-lg hover:bg-white hover:text-black transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
