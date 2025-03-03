import React from "react";
import { useState, useEffect } from "react";
import "../../styles/Profile.css";
import EditBioModal from "../../components/EditProfile/EditBioModal/EditBioModal";
import { useModal } from "../../providers/ModalContext";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../services/userService";

const EditProfileModal = ({ userData, setUserData, editSection }) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    accessToken,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isBioModalOpen,
    setIsBioModalOpen,
  } = useModal();

  // BIO chính thức
  const [bio, setBio] = useState("");

  // BIO tạm thời
  const [tempBio, setTempBio] = useState(userData.bio || "");

  // Xử lý hộp thoại "thêm bio" ngoài phần "chỉnh sửa hồ sơ"
  useEffect(() => {
    if (editSection === "bio") {
      setIsBioModalOpen(true); // Mở luôn phần sửa bio
    }
  }, [editSection]);

  useEffect(() => {
    if (isProfileModalOpen) {
      setTimeout(() => setIsVisible(true), 10);
      // Gọi API lấy dữ liệu khi mở modal
      fetchUserProfile(accessToken)
        .then((data) => {
          setBio(data.bio || ""); // Nếu chưa có bio thì để rỗng
          setTempBio(data.bio || "");
          setUserData(data); // Cập nhật dữ liệu mới từ API
        })
        .catch((error) => console.error("Lỗi khi tải hồ sơ:", error));
    } else {
      setIsVisible(false);
    }
  }, [isProfileModalOpen, accessToken]);

  if (!isProfileModalOpen) return null;

  // Xử lý phần mở "Thêm/chỉnh sửa BIO"

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isBioModalOpen) {
        setIsBioModalOpen(false);
      } else {
        setIsProfileModalOpen(false);
      }
    }
  };

  // Xử lý cập nhật BIO

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(accessToken, tempBio);

      // Cập nhật UI ngay lập tức
      setBio(tempBio);
      setUserData((prev) => ({ ...prev, bio: tempBio }));

      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật tiểu sử:", error);
    }
  };

  return (
    <div className={`profile-overlay ${"active"}`} onClick={handleOverlayClick}>
      <div className={`modal ${isVisible ? "open" : ""}`}>
        <div className="modal-section flex-modal">
          <div>
            <h2>Name</h2>
            <h1>Quốc Trung (@dqtrugg)</h1>
          </div>
          <div className="modal-header-pf">
            <image
              alt="Profile picture of a person with a white background"
              height="50"
              src="https://storage.googleapis.com/a1aa/image/Dzed2Ouf1Wsp7U7k52KrYQfu0ppJt46q83OXbhyWyzayaWNnA.jpg"
              width="50"
            />
          </div>
        </div>
        <hr />
        <div className="modal-section">
          <h3>Tiểu sử</h3>
          <div className="profile-bio" onClick={() => setIsBioModalOpen(true)}>
            {tempBio ? (
              tempBio
                .split("\n")
                .map((line, index) => <p key={index}>{line}</p>)
            ) : (
              <p className="empty">+ Viết tiểu sử</p>
            )}
          </div>
        </div>
        {isBioModalOpen && (
          <EditBioModal
            isOpen={isBioModalOpen}
            onClose={() => setIsBioModalOpen(false)}
            onSave={(newBio) => setTempBio(newBio)}
            initialBio={tempBio}
          />
        )}
        <hr />
        <div className="modal-section">
          <h3>Đường dẫn</h3>
          <p>+ Thêm đường dẫn</p>
        </div>
        <hr />
        <div className="toggle-switch">
          <div>
            <p>Private profile</p>
            <small>
              If you switch to private, you won't be able to reply to others
              unless they follow you.
            </small>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
        <button className="done-button" onClick={handleSaveProfile}>
          Hoàn thành
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
