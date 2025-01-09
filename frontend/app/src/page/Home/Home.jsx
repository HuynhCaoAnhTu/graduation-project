import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utills/axiosInstance";
import HeroSection from "../section/Hero";
import ServicesSection from "../section/Service";
import MealsSection from "../section/Meals";
import ChallengesSection from "../section/Challenges";
import Footer from "../section/footer";

import MealTabs from "../section/Meals";
import BMICalculatorSection from "../section/BMI";
import Meals from "../Meals";

export const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  const handleDelete = (data) => {};

  // const getUserInfo = async () => {
  //   try {
  //     const response = await axiosInstance.get("/get-user");
  //     if (response.data && response.data.user) {
  //       setUserInfo(response.data.user);
  //     }
  //   } catch (error) {
  //     localStorage.clear();
  //     navigate("/");
  //   }
  // };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-note");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error");
    }
  };

  useEffect(() => {
    // getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <div className="">
        {/* {userInfo ?<Narbar userInfo={userInfo} /> : <Narbar />} */}
        <HeroSection></HeroSection>
        <ServicesSection></ServicesSection>
        <Meals></Meals>
        <ChallengesSection></ChallengesSection>
        <BMICalculatorSection></BMICalculatorSection>
        <Footer></Footer>x
      </div>
    </>
  );
};
