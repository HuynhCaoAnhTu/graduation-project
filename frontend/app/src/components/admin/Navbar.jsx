import React from "react";

export const Navbar = ({ userInfo, onLogout }) => {
  return (
    <div className="bg-gray-800 text-white p-2 flex justify-end items-center">
      <div className="flex items-center">
        <span className="mr-4">Hello, {userInfo?.fullName}</span>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
