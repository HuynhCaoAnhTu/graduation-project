import React from "react";
const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-5xl mb-4 text-primary">{icon}</div>
      <h3 className="text-xl md:text-2xl font-semibold text-secondary mb-4">
        {title}
      </h3>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;