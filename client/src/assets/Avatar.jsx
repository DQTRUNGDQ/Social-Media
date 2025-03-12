import React from "react";
import ProTypes from "prop-types";

const getDefaultAvatar = (_id) => {
  return `https://robohash.org/${_id}.png?size=200x200&set=set1`;
};

export default function Avatar({ _id, avatarUrl, size = 80 }) {
  const finalAvatar =
    avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : getDefaultAvatar(_id);

  return (
    <div
      className="profile-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f0f0f0, #dcdcdc)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={finalAvatar}
        alt="User Avatar"
        className="avatar-image"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          zIndex: "9",
        }}
      />
    </div>
  );
}

Avatar.ProTypes = {
  _id: ProTypes.string.isRequired,
  avatarUrl: ProTypes.string,
  size: ProTypes.number,
};
