import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../src/components/admin/Sidebar";
import { Navbar } from "../src/components/admin/Navbar";
import axiosInstance from "../src/utills/axiosInstance";

export const DashboardLayout = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } 
  };

  useEffect(() => {
    getUserInfo();
  }, []);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} userType={userInfo?.type} />

      {/* Main Content */}
      <div className="flex flex-col w-full flex-1">
        {/* Navbar */}
        <Navbar userInfo={userInfo}  />

        {/* Content */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
