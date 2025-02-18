import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Search from "../pages/Search/Search";
import Activity from "../pages/Activity/Activity";
import Profile from "../pages/Profile/Profile";
import LoginLayout from "../layouts/LoginLayout";
import ForgotPassword from "../pages/ForgotPassword/ForgotPasswordMain";

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 60 phút

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("accessToken")
  );

  // Hàm đăng xuất

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let logoutTimer;
    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logout, AUTO_LOGOUT_TIME);
    };

    // Lắng nghe các sự kiện của người dùng để reset thời gian logout
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Khởi động bộ đếm ngay từ đầu

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}

      <Route
        path="/home"
        element={
          <ProtectedRoute element={Home} isAuthenticated={!!isAuthenticated} />
        }
      />
      <Route path="/search" element={<Search />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/login"
        element={
          <LoginLayout>
            <Login setIsAuthenticated={setIsAuthenticated} />
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
