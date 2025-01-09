import React from "react";
import { getInitials } from "../utills/helper";
import { useNavigate } from "react-router-dom";

const ProfileInfo = ({ userInfo }) => {
  const navigate = useNavigate();

  // Hàm xử lý điều hướng
  const handleNavigate = () => {
    navigate("/profile");
  };

  return (
    <div className="flex items-center  justify-center gap-3">
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer bg-slate-100"
        onClick={handleNavigate}
      >
        {getInitials(userInfo?.fullName)}
      </div>

      <div className="flex  flex-col items-center  justify-center">
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
