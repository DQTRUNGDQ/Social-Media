import { useState, useEffect } from "react";

export default function EditBioModal({ isOpen, onClose, onSave, initialBio }) {
  const [bio, setBio] = useState(initialBio || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10); // Kích hoạt animation
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`bio-overlay ${isVisible ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <button className="text-blue-500" onClick={onClose}>
            Hủy bỏ
          </button>
          <h2 className="text-lg font-semibold">Nhập tiểu sử</h2>
          <button
            className="text-blue-500"
            onClick={() => {
              onSave(bio); //Gửi bio về component cha
              onClose();
            }}
          >
            Hoàn thành
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <textarea
              className="bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Viết tiểu sử của bạn..."
            ></textarea>
            <p className="text-gray-500 text-sm">
              Hồ sơ của bạn sẽ được để công khai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
