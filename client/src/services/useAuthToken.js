import { useState, useEffect } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState(null);

  const getAccessToken = () => accessToken;

  const isTokenExpired = (token) => {
    const base64Url = token.split(".")[1]; // Lấy phần payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Chuyển đổi Base64URL thành Base64
    const decoded = JSON.parse(atob(base64)); // Giải mã Base64
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const { accessToken: newAccessToken } = response.data;
      setAccessToken(newAccessToken); // Cập nhật accessToken mới
      localStorage.setItem("accessToken", newAccessToken);
      console.log("accessToken");
    } catch (error) {
      console.error("Failed to refresh token", error);
    }
  };

  const checkTokenExpiration = () => {
    const token = getAccessToken();
    if (token && isTokenExpired(token)) {
      refreshToken(); // Làm mới accessToken nếu hết hạn
    }
  };

  const getValidAccessToken = async () => {
    let accessToken = accessToken || localStorage.getItem("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      accessToken = await refreshToken(); // Làm mới token nếu hết hạn
    }
    return accessToken;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
    const intervalId = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Kiểm tra mỗi 1 phút // Kiểm tra mỗi 5 phút
    return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
  }, [accessToken]);
  return { accessToken, setAccessToken, getValidAccessToken };
};

export default useAuthToken;
