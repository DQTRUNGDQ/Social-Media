import React from "react";
import "../../styles/Profile.css";

const EditProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Chỉ đóng modal nếu click vào vùng overlay
    }
  };
  return (
    <div className="profile-overlay" onClick={handleOverlayClick}>
      <div className="modal ">
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
          <h3>Bio</h3>
          <p>+ Write bio</p>
        </div>
        <hr />
        <div className="modal-section">
          <h3>Link</h3>
          <p>+ Add link</p>
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
