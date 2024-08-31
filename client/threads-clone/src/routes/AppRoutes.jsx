import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import ProtectedRoute from "./ProtectedRoute";
import Search from "../pages/Search/Search";
import Activity from "../pages/Activity/Activity";
import Profile from "../pages/Profile/Profile";

const AppRoutes = () => {
  const isAuthenticated = false;

  return (
    <Routes>
      // <Route path="/" element={<Home />} />
      // <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute element={Home} isAuthenticated={isAuthenticated} />
        }
      />
      <Route path="/search" element={<Search />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
