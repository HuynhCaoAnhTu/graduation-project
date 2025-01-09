import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div>
    <Outlet /> {/* Để render các route con */}
  </div>
);
