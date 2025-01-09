import React from 'react';

const SubscriptionCard = ({ title, price, features, onSubscribe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-4">${price}<span className="text-sm text-gray-500">/month</span></p>
      <ul className="mb-6 text-center">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-700 mb-2">{feature}</li>
        ))}
      </ul>
      <button 
        onClick={onSubscribe}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
        Subscribe
      </button>
    </div>
  );
};

export default SubscriptionCard;
