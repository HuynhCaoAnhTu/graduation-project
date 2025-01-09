import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Fitness Website. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-green-500">Facebook</a>
          <a href="#" className="hover:text-green-500">Instagram</a>
          <a href="#" className="hover:text-green-500">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
