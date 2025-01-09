import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../src/utills/axiosInstance";

// Create a Context
const MainContext = createContext();

// Create a Provider Component
export const MainProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <MainContext.Provider value={{ userInfo,loading }}>
      {children}
    </MainContext.Provider>
  );
};

// Custom hook to use the context
export const useMainContext = () => useContext(MainContext);
