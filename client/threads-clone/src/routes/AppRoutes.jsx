import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Search from "../pages/Search/Search";
import Activity from "../pages/Activity/Activity";
import Profile from "../pages/Profile/Profile";
import LoginLayout from "../layouts/LoginLayout";

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
        path="/login"
        element={
          <LoginLayout>
            <Register />
          </LoginLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
