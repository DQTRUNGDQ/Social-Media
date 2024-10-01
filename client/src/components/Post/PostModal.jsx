// src/components/PostModal.jsx
import React, { useEffect, useState, useRef } from "react";
import "../../styles/Post.css";
import images from "../../assets/loadImage";
import imageCompression from "browser-image-compression";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fileSchema } from "../../utils/validationSchema";
import { Controller, useForm } from "react-hook-form";
import api from "../../services/threadService";

const schema = yup.object().shape({
  mediaType: yup
    .string()
    .oneOf(["file", "url"])
    .required("Bạn phải chọn loại phương tiện"),
  mediaFile: fileSchema.when("mediaType", {
    is: "file",
    then: yup.mixed().required("Bạn phải chọn tệp").nullable(),
    otherwise: yup.mixed().notRequired(),
  }),
  mediaUrl: yup.string().when("mediaType", {
    is: "url",
    then: yup.string().url("URL không hợp lệ").required("Bạn phải nhập URL"),
    otherwise: yup.string().notRequired,
  }),
});

const PostModal = ({ isOpen, onClose }) => {
  const maxLength = 500;
  const warningLimit = 10;
  const blockLimit = -7;
  const placeholderText = "Có điều gì mới?";
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState("");
  const [remainingChars, setRemainingChars] = useState(maxLength);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setContent((prevContent) => [
        ...prevContent,
        <br key={prevContent.length} />,
      ]);
    }
  };

  const handleInput = (e) => {
    const text = e.currentTarget.textContent;
    setContent(text);
    const textLength = text.length;
    const charsLeft = maxLength - textLength;

    if (charsLeft <= warningLimit) {
      setRemainingChars(charsLeft);
    }
  };

  // Xử lý đăng bài
  const { control, handleSubmit, reset, setError, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: "",
      mediaType: "file",
      mediaFile: null,
      mediaUrl: "",
    },
  });

  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Refs để mở file input khi nhấn vào icon
  const fileInputRef = useRef(null);

  const mediaType = watch("mediaType");

  const onSubmit = async (data) => {
    setUploading(true);
    setErrorMessage("");
    setUploadProgress(0);

    let mediaData = {};

    if (
      data.mediaType === "file" &&
      data.mediaFile & (data.mediaFile.length > 0)
    ) {
      let file = data.mediaFile[0];

      // Nếu là hình ảnh, nén trước khi gửi
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          file = compressedFile;
        } catch (error) {
          console.error("Lỗi khi nén hình ảnh:", error);
          setErrorMessage("Nén hình ảnh thất bại");
          setUploading(false);
          return;
        }
      }
      mediaData = { mediaFile: file };
    } else if (data.mediaType === "url" && data.mediaUrl) {
      mediaData = { mediaUrl: data.mediaUrl };
    }

    // Tạo FormData nếu gửi file, hoặc JSON nếu gửi URL
    try {
      let res;
      if (data.mediaType === "file") {
        const formData = new FormData();
        formData.append("content", data.content);
        formData.append("media", mediaData.mediaFile);

        res = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (ProgressEvent) => {
            const percentCompleted = Math.round(
              (ProgressEvent.loaded * 100) / ProgressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
      } else if (data.mediaType === "url") {
        const payload = {
          content: data.content,
          mediaUrl: mediaData.mediaUrl,
          mediaType: mediaData.mediaUrl.includes("image") ? "image" : "video", // Điều chỉnh theo logic của backend
        };

        res = await api.post("/upload", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Xử lý phản hồi thành công
      console.log("Đăng bài thành công:", res.data);
      reset();
      setPreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Gặp lỗi xảy ra khi đăng bài:", error);
      if (error.message && error.res.data && error.res.data.message) {
        setErrorMessage(error.res.data.message);
      } else {
        setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Tạo URL tạm thời
      setPreview(url);
      console.log("File selected:", file);
      console.log("File type: ", file.type);
      console.log("Preview URL:", url);

      // Tạo đối tượng Image để lấy kích thước
      const img = new Image();
      img.src = url;
      img.onload = () => {
        // Giảm kích thước chiều dài và chiều rộng đi
        const originalWidth = img.width;
        const originalHeight = img.height;
        const totalSize = originalWidth + originalHeight;

        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (totalSize > 6000) {
          newWidth = img.width / 9.5;
          newHeight = img.height / 9.5;
        } else if (totalSize < 2000) {
          newWidth = img.width / 2.5;
          newHeight = img.height / 2.5;
        }

        // Lưu kích thước mới vào state
        setImageSize({
          width: newWidth > 0 ? newWidth : originalWidth,
          height: newHeight > 0 ? newHeight : originalHeight,
        });
      };
    } else {
      setPreview(null);
    }
  };

  const handleMediaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsTransitioning(true);
    } else {
      // Delay hiding the modal to allow the closing animation to complete
      const timeout = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <h2 class="modal-title">Chủ đề mới</h2>
      <div
        onsubmit={handleSubmit(onSubmit)}
        className={`modal-content-post ${preview ? "has-image" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content-sub-post">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-info-user">
                <img
                  src={images["avatar.jpg"]}
                  className="profile-image"
                  alt="User Profile"
                />
                <span className="username">dqtrugg</span>
              </div>

              <div className="modal-information">
                <div className="modal-input">
                  <p
                    aria-placeholder={placeholderText}
                    onChange={handleFileChange}
                    contentEditable
                    onkeyDown={handleKeyDown}
                    onInput={handleInput}
                    style={{
                      padding: "10px",
                      minHeight: "21px",
                      width: "100%",
                      whiteSpace: "pre-wrap", // Giữ nguyên khoảng trắng và xuống dòng
                      overflowWrap: "break-word", // Ngắt dòng nếu quá dài
                      outline: "none",
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {content.length === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          color: "#aaa",
                          pointerEvents: "none",
                        }}
                      >
                        {placeholderText}
                      </span>
                    )}
                  </p>
                </div>

                {/* Hiển Thị Xem Trước */}
                {mediaType === "file" && preview && (
                  <div className="media-preview" style={{ marginTop: "10px" }}>
                    {preview ? (
                      <video width="100%" height="auto" controls autoPlay loop>
                        <source src={preview} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          display: "block",
                          width: imageSize.width,
                          height: imageSize.height,
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="more-options">
                <div className="icons">
                  <div className="icon-item">
                    {mediaType === "file" && (
                      <div className="media-upload">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleMediaClick}
                          className="attach-button"
                        >
                          <svg
                            aria-label="Đính kèm phương tiện truyền thông"
                            role="img"
                            viewBox="0 0 24 24"
                          >
                            <title>Attach media</title>
                            <g>
                              <path
                                clip-rule="evenodd"
                                d="M2.00207 9.4959C1.65132 7.00019 1.47595 5.75234 1.82768 4.73084C2.13707 3.83231 2.72297 3.05479 3.50142 2.50971C4.38639 1.89005 5.63425 1.71467 8.12996 1.36392L10.7047 1.00207C13.2004 0.651325 14.4482 0.47595 15.4697 0.827679C16.3682 1.13707 17.1458 1.72297 17.6908 2.50142C17.9171 2.82454 18.0841 3.19605 18.2221 3.65901C17.7476 3.64611 17.2197 3.64192 16.6269 3.64055C16.5775 3.5411 16.5231 3.44881 16.4621 3.36178C16.0987 2.84282 15.5804 2.45222 14.9814 2.24596C14.3004 2.01147 13.4685 2.12839 11.8047 2.36222L7.44748 2.97458C5.78367 3.20841 4.95177 3.32533 4.36178 3.73844C3.84282 4.10182 3.45222 4.62017 3.24596 5.21919C3.01147 5.90019 3.12839 6.73209 3.36222 8.3959L3.97458 12.7531C4.15588 14.0431 4.26689 14.833 4.50015 15.3978C4.50083 16.3151 4.50509 17.0849 4.53201 17.7448C4.13891 17.4561 3.79293 17.1036 3.50971 16.6991C2.89005 15.8142 2.71467 14.5663 2.36392 12.0706L2.00207 9.4959Z"
                                fill="currentColor"
                                fill-rule="evenodd"
                              ></path>
                              <g>
                                <g clip-path="url(#:r80:)">
                                  <rect
                                    fill="none"
                                    height="15.5"
                                    rx="3.75"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    width="15.5"
                                    x="6.75"
                                    y="5.8894"
                                  ></rect>
                                  <path
                                    d="M6.6546 17.8894L8.59043 15.9536C9.1583 15.3857 10.0727 15.3658 10.6647 15.9085L12.5062 17.5966C12.9009 17.9584 13.5105 17.9451 13.8891 17.5665L17.8181 13.6376C18.4038 13.0518 19.3536 13.0518 19.9394 13.6375L22.0663 15.7644"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                  ></path>
                                  <circle
                                    cx="10.75"
                                    cy="9.8894"
                                    fill="currentColor"
                                    r="1.25"
                                  ></circle>
                                </g>
                              </g>
                            </g>
                            <defs>
                              <clipPath id=":r80:">
                                <rect
                                  fill="white"
                                  height="17"
                                  rx="4.5"
                                  width="17"
                                  x="6"
                                  y="5.1394"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </button>

                        <Controller
                          name="mediaFile"
                          control={control}
                          render={({ field, fieldState }) =>
                            fieldState.error && (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {fieldState.error.message}
                              </span>
                            )
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="icon-item">
                    <svg
                      fill="none"
                      height="24"
                      title="123"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>GIF Picker Icon</title>
                      <g clip-path="url(#:r13:)">
                        <path
                          d="M20.6472 13.7545L21.2766 14.1623L20.6472 13.7545C20.4715 14.0256 20.2404 14.2752 19.647 14.9058L15.4667 19.3473C14.7767 20.0804 14.5029 20.3659 14.1962 20.5791C13.785 20.8649 13.3208 21.0655 12.8308 21.169C12.4654 21.2462 12.0698 21.25 11.0631 21.25C9.62515 21.25 8.58506 21.2496 7.76313 21.1923C6.94813 21.1356 6.40373 21.0256 5.95094 20.8336C4.69662 20.3019 3.69812 19.3034 3.16638 18.0491C2.97444 17.5963 2.86444 17.0519 2.80767 16.2369C2.75042 15.4149 2.75 14.3748 2.75 12.9369V11.6C2.75 9.90747 2.75058 8.68317 2.82925 7.72029C2.90721 6.76615 3.05809 6.13493 3.32222 5.61655C3.82555 4.6287 4.6287 3.82555 5.61655 3.32222C6.13493 3.05809 6.76615 2.90721 7.72029 2.82925C8.68317 2.75058 9.90747 2.75 11.6 2.75H13.1363C14.48 2.75 15.4519 2.75037 16.2211 2.80049C16.984 2.8502 17.4953 2.94657 17.9222 3.11455C19.2784 3.64817 20.3518 4.72155 20.8855 6.07779C21.0534 6.50473 21.1498 7.01596 21.1995 7.77888C21.2496 8.54813 21.25 9.52002 21.25 10.8637C21.25 11.7295 21.2472 12.0697 21.1893 12.3875C21.1006 12.8745 20.9163 13.3391 20.6472 13.7545Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        ></path>
                        <path
                          d="M13 21V19.3784V19.3784C13 15.8557 15.8557 13.0001 19.3784 13.0002V13.0002H21"
                          stroke="currentColor"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                        ></path>
                        <path
                          d="M8.33957 11.406C6.68121 11.406 5.69995 10.432 5.69995 8.69756C5.69995 6.98488 6.68121 6 8.2925 6C9.33894 6 10.1283 6.44899 10.4361 6.99936C10.5121 7.14058 10.5411 7.26369 10.5411 7.39404C10.5411 7.77785 10.2731 8.04218 9.88207 8.04218C9.58153 8.04218 9.35342 7.92631 9.16513 7.67647C8.91891 7.34697 8.66907 7.20937 8.29974 7.20937C7.64798 7.20937 7.26417 7.74526 7.26417 8.67583C7.26417 9.62812 7.7023 10.1966 8.37578 10.1966C8.87546 10.1966 9.23031 9.91779 9.27376 9.49777L9.281 9.42535H8.98047C8.63648 9.42535 8.41199 9.24431 8.41199 8.91481C8.41199 8.58531 8.63286 8.40426 8.98047 8.40426H9.99069C10.4795 8.40426 10.7583 8.69393 10.7583 9.2081C10.7583 10.4501 9.89655 11.406 8.33957 11.406Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M12.5259 11.406C12.0371 11.406 11.7583 11.1163 11.7583 10.6021V6.80384C11.7583 6.28967 12.0371 6 12.5259 6C13.0147 6 13.2936 6.28967 13.2936 6.80384V10.6021C13.2936 11.1163 13.0147 11.406 12.5259 11.406Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M15.3112 11.3606C14.8224 11.3606 14.5436 11.0709 14.5436 10.5568V6.849C14.5436 6.33484 14.8224 6.04517 15.3112 6.04517H17.6105C18.0232 6.04517 18.2876 6.26604 18.2876 6.65709C18.2876 7.04815 18.016 7.26902 17.6105 7.26902H16.0788V8.26839H17.4548C17.8386 8.26839 18.0848 8.4784 18.0848 8.84411C18.0848 9.20981 17.8458 9.41983 17.4548 9.41983H16.0788V10.5568C16.0788 11.0709 15.8 11.3606 15.3112 11.3606Z"
                          fill="currentColor"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id=":r13:">
                          <rect
                            fill="white"
                            height="20"
                            transform="translate(2 2)"
                            width="20"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="icon-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
                      />
                    </svg>
                  </div>
                  <div className="icon-item">
                    <svg aria-label="Add a poll" role="img" viewBox="0 0 24 24">
                      <title>Add a poll</title>
                      <rect
                        fill="currentColor"
                        height="1.5"
                        rx="0.75"
                        width="8"
                        x="4"
                        y="5.5"
                      ></rect>
                      <rect
                        fill="currentColor"
                        height="1.5"
                        rx="0.75"
                        width="16"
                        x="4"
                        y="11.25"
                      ></rect>
                      <rect
                        fill="currentColor"
                        height="1.5"
                        rx="0.75"
                        width="11"
                        x="4"
                        y="17"
                      ></rect>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="vertical-divider"></div>
          </div>
          <div className="thread-child">
            <img
              src={images["avatar.jpg"]}
              className="avatar-image"
              alt="User Profile"
            />
            <span>Thêm vào chủ đề</span>
          </div>
        </div>
        <div className="privacy-post">
          <span>Bất cứ ai cũng có thể trả lời và trích dẫn</span>

          <div>
            {remainingChars <= warningLimit && (
              <div style={{ color: "red" }}>{remainingChars} ký tự còn lại</div>
            )}
          </div>

          <div className="modal-actions">
            <button className="post-button">Đăng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
