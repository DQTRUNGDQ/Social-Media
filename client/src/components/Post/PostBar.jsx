// src/components/PostBar.jsx
import React, { useEffect, useState } from "react";
import "../../styles/Post.css";
import images from "../../assets/loadImage";
import api from "../../services/threadService";
import { Loading } from "../Loading/Loading";

const PostBar = ({ onClick }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("accessToken");
        const response = await api.get("/posts", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        setPosts(response.data.posts);
        console.log("Danh sách bài viết:", response.data.posts);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải bài viết.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (loading) {
    <Loading />;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Social Media Post</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body class="bg-gray-100 p-4">
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
                class="max-w-l bg-white p-4 rounded-lg shadow-md"
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
                    <div class="text-gray-500 text-sm">4h</div>
                  </div>
                </div>
                <div class="mb-4">
                  <p>
                    Niềm vui lớn nhất của anh là được học, được ở bên những
                    người mình yêu thương mỗi ngày, có cho mình niềm tin và mục
                    đích rõ ràng. Cuộc sống đôi khi mang đến những niềm vui và
                    nỗi buồn, nhưng em hãy nhớ mọi chuyện rồi sẽ qua. Đừng bận
                    tâm đến những điều không đáng, dành những điều đấy ở cuối
                    ngày, anh sẽ lắng nghe.
                  </p>
                  <p class="text-blue-500">Translate</p>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <img
                    alt="Person petting a dog on the street"
                    class="rounded-lg"
                    height="300"
                    src="https://storage.googleapis.com/a1aa/image/1tsKRtSwVm5hHVi112fgzflz4NIxa3BtYZ7blvPu7fdLyjtnA.jpg"
                    width="200"
                  />
                  <img
                    alt="Tablet showing a profile page"
                    class="rounded-lg"
                    height="300"
                    src="https://storage.googleapis.com/a1aa/image/tN6d41mdfkydGSNeIKRY4dqmJeXlfCsBB8ZVcRqknuidkHbPB.jpg"
                    width="200"
                  />
                  <img
                    alt="Hand writing on a notebook with a laptop in the background"
                    class="rounded-lg"
                    height="300"
                    src="https://storage.googleapis.com/a1aa/image/e2lcp4f2uHnDXk4GOEM3wLjQpkT38ALjCNplFVigZF6E5x2TA.jpg"
                    width="200"
                  />
                </div>
                <div class="flex items-center mt-4 text-gray-500">
                  <div class="flex items-center mr-4">
                    <i class="fas fa-heart"></i>
                    <span class="ml-1">112</span>
                  </div>
                  <div class="flex items-center mr-4">
                    <i class="fas fa-comment"></i>
                    <span class="ml-1">1</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-share"></i>
                    <span class="ml-1">3</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có bài viết nào để hiển thị.</p>
          )}
        </div>
      </body>
    </html>
  );
};

export default PostBar;
