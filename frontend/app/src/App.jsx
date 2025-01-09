import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignUp } from "./page/SignUp/SignUp";
import { Login } from "./page/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServicePage from "./page/Service";
import axiosInstance from "./utills/axiosInstance";
import { Home } from "./page/Home/home";
import { MainLayout } from "../layout/MainLayout ";
import { AuthLayout } from "../layout/AuthLayout ";
import ExerciseCRUD from "./page/admin/ExerciseCRUD";
import ManageUsers from "./page/admin/ManageUsers";
import ManageExercise from "./page/admin/ManageExercise";
import { DashboardLayout } from "../layout/DashboardLayout";
import AboutUs from "./page/AboutUs";
import { MainProvider } from "../context/UserContext";
import PushUpCounter from "./components/challenger/PushupCounter";
import Profile from "./page/Profile";
import ExerciseHistory from "./page/profile/ExcerciseHistory";
import Supcription from "./page/Subscription";
import Subscription from "./page/Subscription";
import Meals from "./page/Meals";
import ManageRecipes from "./page/admin/ManageRecipe";
import SquatCounter from "./components/challenger/SquatCounter";
import ManageRecipeCategory from "./page/admin/ManageRecipeCategory";
import MyRecipes from "./page/profile/MyRecipes";

const App = () => {
  return (
    <MainProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
        {/* <Narbar userInfo={userInfo} /> */}
        <Routes>
          {/* Routes sử dụng layout có navbar */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/" element={<Home />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/meals" element={<Meals />} />
            <Route
              path="/profile/exercise-history"
              element={<ExerciseHistory />}
            />
                <Route
              path="/profile/pinned-recipes"
              element={<MyRecipes />}
            />


            <Route
              path="/challenge-player/pushups"
              element={<PushUpCounter />}
            />
            <Route path="/challenge-player/squat" element={<SquatCounter />} />
          </Route>

          {/* Routes sử dụng layout không có navbar */}
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignUp />} />

            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/manage-users" element={<ManageUsers />} />
            <Route
              path="/dashboard/manage-recipes"
              element={<ManageRecipes />}
            />
            <Route
              path="/dashboard/manage-recipe-category"
              element={<ManageRecipeCategory />}
            />
            <Route path="/admin/exercise" element={<ExerciseCRUD />} />
            <Route
              path="/dashboard/manage-posts"
              element={<ManageExercise />}
            />
          </Route>
        </Routes>
      </Router>
    </MainProvider>
  );
};

export default App;
