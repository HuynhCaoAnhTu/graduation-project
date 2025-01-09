import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"; // Icons từ react-icons

export const Sidebar = ({isCollapsed,setIsCollapsed,userType}) => {
  const [menuItems, setMenuItems] = useState([
    {
      path: "/dashboard/manage-users",
      name: "Manage Users",
      icon: <AiOutlineUser />,
    },
    {
      path: "/admin/exercise",
      name: "Manage Excercise",
      icon: <AiOutlineHome />,
    },
    {
      path: "/dashboard/manage-recipes",
      name: "Manage Recipes",
      icon: <AiOutlineHome />,
    },
    {
      path: "/dashboard/manage-recipe-category",
      name: "Recipes Category",
      icon: <AiOutlineSetting />,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: <AiOutlineSetting />,
    },
  ]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const checkPermit = () => {
    if (userType == 0) {
      const updatedMenuItems = menuItems.filter(
        (item) => item.name !== "Manage Users"
      );
      setMenuItems(updatedMenuItems);
    }
  };

  useEffect(() => {
    checkPermit();
  }, []);

  return (
    <div
      className={`h-screen bg-gray-700 text-white transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Menu Items */}
      <nav className="mt-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-4 mx-4">Admin Menu</h2>
        {menuItems
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-2 py-2 mx-2 rounded hover:bg-gray-600 ${
                  isActive ? "bg-gray-600" : ""
                }`
              }
            >
              {/* Icon */}
              <span className="text-xl">{item.icon}</span>

              {/* Name - Chỉ hiển thị khi không thu nhỏ */}
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 p-2 bg-gray-700  rounded-full"
      >
        {isCollapsed ? <AiOutlineArrowRight /> : <AiOutlineArrowLeft />}
      </button>
    </div>
  );
};
