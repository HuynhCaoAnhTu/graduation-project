import React, { useState } from 'react';

const BMICalculatorSection = () => {
  // Các state để lưu trữ giá trị nhập từ người dùng
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  // Hàm tính BMI và phân loại
  const calculateBMI = () => {
    if (!weight || !height) return;
    // Chuyển đổi chiều cao từ cm sang m
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi);

    // Phân loại BMI
    let bmiCategory = '';
    if (calculatedBmi < 18.5) {
      bmiCategory = 'Underweight';
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
      bmiCategory = 'Normal weight';
    } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }
    setCategory(bmiCategory);
  };

  return (
    <section className="bg-gray-100 py-8 px-6 md:px-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">BMI Calculator</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Weight (kg):</label>
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            placeholder="Enter your weight" 
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Height (cm):</label>
          <input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            placeholder="Enter your height in cm" 
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button 
          onClick={calculateBMI} 
          className="w-full bg-blue-500 text-white py-3 rounded-md font-bold hover:bg-blue-600 transition"
        >
          Calculate BMI
        </button>

        {/* Hiển thị kết quả BMI */}
        {bmi && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-800">Your BMI: {bmi.toFixed(2)}</h3>
            <p className="text-lg text-gray-700">Category: {category}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BMICalculatorSection;
