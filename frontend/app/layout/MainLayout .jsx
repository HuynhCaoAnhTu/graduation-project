import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../src/components/Navbar";
import axiosInstance from "../src/utills/axiosInstance";
import { useMainContext } from "../context/UserContext";

export const MainLayout = () => {
  const { userInfo, loading } = useMainContext();
  if (loading) {
    return <div></div>; // Hiển thị loading khi đang tải dữ liệu
  }
  return (
    <>
      <Navbar userInfo={userInfo} />
      <Outlet /> {/* Để render các route con */}
    </>
  );
};
