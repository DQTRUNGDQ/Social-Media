// src/components/PostBar.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/Post.css";
import images from "../../assets/loadImage";
import api from "../../services/threadService";
import "font-awesome/css/font-awesome.min.css";
import io from "socket.io-client";

const PostBar = ({ onClick }) => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [error, setError] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const authToken = localStorage.getItem("accessToken");

        // Lấy danh sách các bài viết từ API chính
        const postsResponse = await api.get("/posts", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        // Kiểm tra xem có bài viết nào đã like không
        const postsData = postsResponse.data.posts || [];
        const anyPostLiked = postsData.some((post) => post.isLiked); // Kiểm tra có bài viết nào đã like

        // Nếu có bài viết nào đã like, mới gọi API likedPosts
        let likedPostsData = [];
        if (anyPostLiked) {
          const likedPostsResponse = await api.get("/posts/liked", {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });

          likedPostsData = likedPostsResponse.data || [];
        }

        // Cập nhật trạng thái isLiked cho mỗi bài viết dựa trên likedPostsData
        const formattedPosts = postsData.map((post) => ({
          ...post,
          isLiked: likedPostsData.some(
            (likedPost) => likedPost && likedPost._id === post._id // Kiểm tra có likedPost không phải null/undefined
          ),
        }));

        // Cập nhật state
        setPosts(formattedPosts);
        setLikedPosts(likedPostsData);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải bài viết.");
        console.log(error);
      }
    };
    fetchPosts();

    socket.current = io("http://localhost:3000");

    // Xử lý sự kiện nhận
    socket.current.on("connect", () => {
      socket.current.emit("getLikedPosts");
    });
    socket.current.on("likedPosts", (data) => {
      console.log("Connected to server");
      const { postId, isLiked, likesCount } = data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, isLiked, likesCount } : post
        )
      );
      setLikedPosts((prevLikedPosts) =>
        isLiked
          ? [...prevLikedPosts, postId]
          : prevLikedPosts.filter((likedPostId) => likedPostId !== postId)
      );
    });
    if (socket.connected) {
      console.log("Socket is connected");
    }

    // Xóa kết nối WebSocket khi component unmount (tùy chọn)
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  // Xử lý thời gian đăng bài
  const formatPostTime = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffMs = now - postTime;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

    // Xử lý các trường hợp
    if (minutes < 1) return "Just now"; // < 1 phút
    if (minutes < 60) return `${minutes}m`; // < 60 phút
    if (hours < 24) return `${hours}h`; // < 24 giờ
    if (days < 7) return `${days}d`; // < 7 ngày

    // Nếu > 7 ngày, trả về định dạng dd/mm/yy
    const day = postTime.getDate().toString().padStart(2, "0");
    const month = (postTime.getMonth() + 1).toString().padStart(2, "0");
    const year = postTime.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleToggleLike = async (postId) => {
    try {
      const authToken = localStorage.getItem("accessToken");
      const response = await api.post(
        "/like",
        { threadId: postId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Cập nhật trạng thái like của bài viết
        const { isLiked, likesCount } = response.data;
        socket.current.emit("likePost", { postId, isLiked, likesCount });
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isLiked, likesCount } : post
          )
        );
        setLikedPosts((prevLikedPosts) =>
          isLiked
            ? [...prevLikedPosts, postId]
            : prevLikedPosts.filter((likedPostId) => likedPostId !== postId)
        );
      }
    } catch (err) {
      console.error("Thread no longer exists or has been deleted");
    }
  };

  return (
    <div class="bg-gray-100 p-4">
      <div className="post-container">
        <div className="post-bar">
          <img
            src={images["avatar.jpg"]}
            alt="Profile"
            className="avatar-image"
          />
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
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              class="posts-content max-w-l bg-white p-4 rounded-lg shadow-md"
            >
              <div class="flex items-center mb-4">
                <img
                  alt="Profile picture"
                  class="w-10 h-10 rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/jZuQXyLaNh4AE5ABZdvUTSbXesEfFiPD9nHs8L7qNErG5x2TA.jpg"
                  width="40"
                />
                <div class="ml-3">
                  <div class="font-bold">{post.author?.username}</div>
                  <div class="text-gray-500 text-sm">
                    {formatPostTime(post.createdAt)}
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <p class="post-content">{post.content}</p>
                <p className="post-hashtags">
                  {Array.isArray(post.hashtags) ? (
                    post.hashtags.map((hashtag, index) => (
                      <span key={index} className="hashtag">
                        {hashtag}{" "}
                      </span>
                    ))
                  ) : (
                    <span>No hashtags available</span>
                  )}
                </p>
                <p class="text-lg post-translate">Translate</p>
              </div>
              <div class="grid ">
                {post.images?.length > 0 && (
                  <div className="post-images">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post Image ${index + 1}`}
                        width={400}
                        style={{ marginRight: "10px" }}
                      />
                    ))}
                  </div>
                )}
                {/* Hiển thị video nếu có */}
                {post.videos?.length > 0 &&
                  post.videos.every((video) => video.startsWith("http")) && (
                    <div className="post-videos">
                      {post.videos.map((video, index) => (
                        <video
                          key={index}
                          video
                          width="100%"
                          height="auto"
                          controls
                          autoPlay
                          loop
                        >
                          <source src={video} type="video/mp4" />
                          Trình duyệt của bạn không hỗ trợ video.
                        </video>
                      ))}
                    </div>
                  )}
              </div>
              <div class="flex items-center mt-4 text-gray-500">
                <button
                  className={`like-button ${post.isLiked ? "liked" : ""}`}
                  onClick={() => handleToggleLike(post._id)}
                >
                  <i className="fa fa-heart heart-icon"></i>
                  <span class="ml-1">{post.likesCount}</span>
                </button>
                <div class="flex items-center mr-4">
                  <i class="fas fa-comment"></i>
                  <span class="ml-1">0</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-share"></i>
                  <span class="ml-1">0</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bài viết nào để hiển thị.</p>
        )}
      </div>
    </div>
  );
};

export default PostBar;
