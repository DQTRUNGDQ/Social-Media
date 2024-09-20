import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Search from "../pages/Search/Search";
import Activity from "../pages/Activity/Activity";
import Profile from "../pages/Profile/Profile";
import LoginLayout from "../layouts/LoginLayout";
import ForgotPassword from "../pages/ForgotPassword/ForgotPasswordMain";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";

const AppRoutes = () => {
  const isAuthenticated = localStorage.getItem("accessToken");

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
      <Route
        path="/login"
        element={
          <LoginLayout>
            <Login />
          </LoginLayout>
        }
      />
      <Route path="/activity" element={<Activity />} />
      <Route
        path="/register"
        element={
          <LoginLayout>
            <Register />
          </LoginLayout>
        }
      />
      <Route
        path="/forget-password"
        element={
          <LoginLayout>
            <ForgotPassword />
          </LoginLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
