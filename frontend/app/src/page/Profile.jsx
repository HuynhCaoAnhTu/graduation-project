import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../context/UserContext";
import { getInitials } from "../utills/helper";

const Profile = () => {
  const navigate = useNavigate(); // Điều hướng giữa các trang
  const { userInfo } = useMainContext();

  const onLogout = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Ảnh đại diện và thông tin cơ bản */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full cursor-pointer border-2 border-indigo-500 bg-yellow-100">
            {getInitials(userInfo.fullName)}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {userInfo.fullName || "Name"}
          </h2>
          <p className="text-gray-600">{userInfo.email || "Email"}</p>
        </div>

        {/* Các mục trong Profile */}
        <div className="space-y-6">
          {/* Thông tin cá nhân */}
          <SectionItem
            title="Personal Information "
            onClick={() => navigate("./edit-profile")}
          />

          {/* Lịch sử bài tập */}
          <SectionItem
            title="Excerises History"
            onClick={() => navigate("./exercise-history")}
          />

          {/* Bookmark Meal */}
          <SectionItem
            title="Pinned recipes"
            onClick={() => navigate("./pinned-recipes")}
          />

          {/* Đăng xuất */}
          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-center font-medium transition duration-200"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị từng mục
const SectionItem = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition duration-200"
  >
    <span className="text-gray-800 font-medium">{title}</span>
    <svg
      className="w-5 h-5 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      ></path>
    </svg>
  </button>
);

export default Profile;
