import React, { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogin = () => navigate("/login");

  const handleRegister = () => navigate("/signup");

  const ProfileClick = () => navigate("/profile");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-500 to-blue-700 bg-opacity-90 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex justify-between items-center h-14 px-4 md:px-8">
        {/* Logo */}
        <div
          className="text-white text-lg font-extrabold tracking-wider cursor-pointer"
          onClick={() => navigate("/")}
        >
          FitBrand
        </div>

        {/* Center navigation links */}
        <div className="hidden md:flex space-x-8">
          {["Home", "About Us", "Services", "Meals", "Subscription"].map(
            (item, index) => (
              <a
                key={index}
                href={`/${item.toLowerCase().replace(/\s+/g, "")}`}
                className="text-white text-sm font-medium hover:text-gray-200 transition-colors duration-300"
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Right section: Login/Register */}
        <div className="hidden md:flex space-x-4">
          {userInfo ? (
            <ProfileInfo userInfo={userInfo} />
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition duration-300 shadow-md"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="text-white md:hidden" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-14 right-0 w-2/4 bg-blue-500 bg-opacity-90 backdrop-blur-md shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          {["Home", "About Us", "Services", "Meals", "Subscription"].map(
            (item, index) => (
              <li key={index}>
                <a
                  onClick={() => {
                    navigate(`/${item.toLowerCase().replace(/\s+/g, "")}`);
                  }}
                  className="text-white text-lg hover:bg-blue-600 px-6 py-2 rounded-md transition duration-300"
                >
                  {item}
                </a>
              </li>
            )
          )}
          <li>
            {userInfo ? (
              <ProfileInfo userInfo={userInfo} />
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white font-medium transition duration-300"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-white font-medium transition duration-300"
                >
                  Register
                </button>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
