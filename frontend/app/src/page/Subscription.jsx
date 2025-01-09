import React from 'react';
import SubscriptionCard from '../components/sup/SubscriptionCard';

const Subscription = () => {
  const plans = [
    {
      title: 'Basic',
      price: 10,
      features: [
        'Access to basic workouts',
        'Personalized diet plan',
        'Email support',
      ],
    },
    {
      title: 'Middle',
      price: 20,
      features: [
        'Access to all workouts',
        'Personalized diet plan',
        'One-on-one coaching',
        'Priority support',
      ],
    },
    {
      title: 'VIP',
      price: 50,
      features: [
        'Unlimited workout plans',
        'Customized diet plans',
        'One-on-one coaching',
        '24/7 VIP support',
        'Access to exclusive content',
      ],
    },
  ];

  const handleSubscribe = (plan) => {
    alert(`You have selected the ${plan} plan!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Fitness Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <SubscriptionCard
            key={index}
            title={plan.title}
            price={plan.price}
            features={plan.features}
            onSubscribe={() => handleSubscribe(plan.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default Subscription;
