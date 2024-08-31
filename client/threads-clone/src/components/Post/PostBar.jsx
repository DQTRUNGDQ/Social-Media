// src/components/PostBar.jsx
import React from "react";
import "../../styles/Post.css";
import images from "../../assets/loadImage";

const PostBar = ({ onClick }) => {
  return (
    <div className="post-bar">
      <img src={images["avatar.jpg"]} alt="Profile" className="avatar-image" />
      <input
        type="text"
        placeholder="Bắt đầu thread..."
        className="post-input"
        readOnly
        onClick={onClick}
      />
      <button className="post-button-bar" onClick={onClick}>
        Đăng
      </button>
    </div>
  );
};

export default PostBar;
