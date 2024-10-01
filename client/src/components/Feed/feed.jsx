import React, { useState } from "react";
import DropdownTabNavigation from "../DropdownTabNavigation/DropdownTabNavigation";
import ForYou from "../../pages/Home/ForYou";
import Following from "../../pages/Home/Following";

const Feed = () => {
  const [selectedTab, setSelectedTab] = useState("Dành cho bạn");

  const renderContent = () => {
    switch (selectedTab) {
      case "Dành cho bạn":
        return <ForYou />;
      case "Đang theo dõi":
        return <Following />;
      case "Đã thích":
        return <div>Content Liked</div>;
      case "Đã lưu":
        return <div>Content Saved</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="feed">
      <DropdownTabNavigation onTabChange={setSelectedTab} />
      <div className="feed-content">{renderContent()}</div>
    </div>
  );
};

export default Feed;
