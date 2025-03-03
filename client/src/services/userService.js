import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const fetchUserProfile = async (accessToken) => {
  try {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Kiểm tra dữ liệu trả về
    if (res.data && res.data.user) {
      return res.data.user;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Để có thể xử lý lỗi ở nơi gọi hàm này
  }
};

export const updateUserProfile = async (accessToken, newBio) => {
  try {
    const res = await axios.put(
      `${API_URL}/update-profile`,
      { bio: newBio },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating bio", error);
    throw error;
  }
};
