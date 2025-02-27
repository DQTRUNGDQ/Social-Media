import React, { createContext, useContext, useState } from "react";

// Tạo Context
const ModalContext = createContext();

// Provider chứa toàn bộ state của modal
export const ModalProvider = ({ children }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isProfileModalOpen,
        setIsProfileModalOpen,
        isBioModalOpen,
        setIsBioModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
