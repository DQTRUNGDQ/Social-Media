import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../services/userService";
import "../../styles/Profile.css";
import Sidebar from "../../components/Sidebar/sidebar";
import EditProfileModal from "./EditProfile";

export default function Profile() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Giả sử bạn lưu token ở đây
    if (!token) {
      navigate("/login");
    } else {
      setAccessToken(token);
    }
  }, [navigate]);

  const {
    data: user,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["userProfile", accessToken],
    queryFn: async () => {
      if (!accessToken) throw new Error("No access token");
      const profile = await fetchUserProfile(accessToken);
      console.log("Fetched Profile:", profile); // Log profile
      return profile;
    },
    enabled: !!accessToken,
  });
  if (isLoading || isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error loading user profile</div>;
  if (!user) {
    return <div>No user data available</div>;
  }

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="profile-main">
      <Sidebar />
      <div className="profile-main-content">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-container">
          <div className="profile-information">
            <div className="basic-info">
              <div className="profile-user-name">
                <div className="profile-user-usedname">{user.name}</div>
                <div className="profile-user-tagname">{user.username}</div>
              </div>
              <div className="profile-user-avatar">
                <img alt="" />
              </div>
            </div>
            <div className="minimum-info">
              <div className="followers">
                <div className="followers-user-avatar">
                  <img alt="" />
                  <img alt="" />
                </div>
                <div className="quantity-followers">12 người theo dõi</div>
              </div>
              <div className="joined-in">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                  </g>
                </svg>
                <span>Đã tham gia 11/2023</span>
              </div>
            </div>
            <div>
              <button className="edit-profile" onClick={handleEditProfileClick}>
                Chỉnh sửa hồ sơ
              </button>
            </div>
            <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
            <div className="detail-profile">
              <div className="profile-options">
                <div className="pro-options-item border-active">
                  <div className="item-text">Chủ đề</div>
                </div>
                <div className="pro-options-item">
                  <div className="item-text">Trả lời</div>
                </div>
                <div className="pro-options-item">
                  <div className="item-text">Đăng lại</div>
                </div>
              </div>
              <div className="profile-info-detail">
                <div className="finish-profile">
                  <span className="title-finish">Hoàn thành hồ sơ của bạn</span>
                  <span className="unfinished">chỉ còn 1</span>
                </div>
                <div className="info-profile">
                  <div className="info-item">
                    <div className="icon-item">
                      <svg aria-label="" role="img" viewBox="0 0 24 24">
                        <title></title>
                        <path
                          d="M6.17225,22H2V17.82775L17.29142,2.53634a1.83117,1.83117,0,0,1,2.58967,0l1.58257,1.58257a1.83117,1.83117,0,0,1,0,2.58967Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        ></path>
                        <line
                          x1="15.01842"
                          x2="19.19067"
                          y1="4.80933"
                          y2="8.98158"
                        ></line>
                      </svg>
                    </div>
                    <div className="content-item">Thêm bio</div>
                    <div className="guess-item">
                      Giới thiệu bản thân và cho mọi người biết sở thích của
                      bạn.
                    </div>
                    <div className="btn-item unactive">
                      <button className="btn-text">Thêm</button>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="icon-item">
                      <svg
                        aria-label=""
                        role="img"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      >
                        <title></title>
                        <polyline points="21.648 5.352 9.002 17.998 2.358 11.358"></polyline>
                      </svg>
                    </div>
                    <div className="content-item">Thêm ảnh cho hồ sơ</div>
                    <div className="guess-item">
                      Giúp mọi người dễ dàng nhận ra bạn hơn.
                    </div>
                    <div className="btn-item">
                      <button className="btn-text">Đã hoàn thành</button>
                    </div>
                  </div>
                  <div className="info-item"></div>
                  <div className="info-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
