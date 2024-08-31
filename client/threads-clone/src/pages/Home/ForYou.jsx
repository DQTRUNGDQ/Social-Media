import React, { useState } from "react";
import PostBar from "../../components/Post/PostBar";
import PostModal from "../../components/Post/PostModal";

const ForYou = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PostBar onClick={handleOpenModal} />
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {/* Nội dung khác của tab For You */}
    </div>
  );
};

export default ForYou;
