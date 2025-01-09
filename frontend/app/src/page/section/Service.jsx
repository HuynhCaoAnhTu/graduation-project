import React from "react";
import ServiceCard from "../../components/ServiceCard";

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Personalized Fitness Plans"
            description="Get a workout plan tailored to your fitness goals, whether it's weight loss, muscle gain, or overall health."
            icon="🏋️‍♂️"
          />
          <ServiceCard
            title="Expert Trainers"
            description="Work with certified trainers who will guide you through every step of your fitness journey."
            icon="👨‍🏫"
          />
          <ServiceCard
            title="Healthy Meal Plans"
            description="Discover meal plans that match your fitness goals to fuel your body with the right nutrients."
            icon="🥗"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
