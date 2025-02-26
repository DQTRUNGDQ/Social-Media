import React from "react";
import { useState, useEffect } from "react";
import "../../styles/Profile.css";
import EditBioModal from "../../components/EditProfile/EditBioModal/EditBioModal";

const EditProfileModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10); // Kích hoạt animation sau khi render
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isBioModalOpen) {
        setIsBioModalOpen(false);
      } else {
        onClose();
      }
    }
  };

  return (
    <div
      className={`profile-overlay ${isOpen ? "active" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={`modal ${isVisible ? "open" : ""}`}>
        <div className="modal-section flex-modal">
          <div>
            <h2>Name</h2>
            <h1>Quốc Trung (@dqtrugg)</h1>
          </div>
          <div className="modal-header-pf">
            <img
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
          <p onClick={() => setIsBioModalOpen(true)}>+ Viết tiểu sử</p>
        </div>
        <EditBioModal
          isOpen={isBioModalOpen}
          onClose={() => setIsBioModalOpen(false)}
          onSave={(newBio) => setBio(newBio)}
          initialBio={bio}
        />
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
        <button className="done-button">Done</button>
      </div>
    </div>
  );
};

export default EditProfileModal;
