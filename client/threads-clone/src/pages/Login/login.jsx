import React, { useState } from "react";
import axios from "axios";
import images from "../../assets/loadImage";
import { useNavigate } from "react-router-dom";
import Register from "../Register/Register.jsx";
import ForgotPasswordModal from "../ForgotPassword/ForgotPassword";
import ForgotPasswordCode from "../ForgotPassword/ForgotPasswordCode";
import useAuthToken from "../../services/useAuthToken";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showForgotPasswordForm, setForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false); // Added state for loginAttempted
  const { setAccessToken } = useAuthToken();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginAttempted(true); // Update state when clicking "Login"
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const accessToken = res.data.result.accessToken;
      setAccessToken(accessToken);

      localStorage.setItem("accessToken", accessToken);

      setSuccessMessage("Login successful");
      if (accessToken) {
        navigate("/home");
      }
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Incorrect password or email");
      setSuccessMessage("");
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setLoginAttempted(false); // Ensure no change in state when clicking "Create Account"
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordOpen(true);
    console.log("Modal is open:", showForgotPasswordForm);
  };

  const handleForgotPasswordNext = (enteredEmail) => {
    setEmail(enteredEmail);
    setStep("code");
    setForgotPasswordOpen(false);
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className="background-login">
          <img
            src={images["background.jpg"]}
            alt="background-login"
            width="1785px"
            height="510px"
          />
        </div>
        <div className="form-login">
          <form onSubmit={handleLogin}>
            <div className="txt-login txt-align">
              Login with your Threads account
            </div>
            <div className="form-input">
              <input
                className="input-styled"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-input">
              <input
                className="input-styled"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mg-b">
              <button type="submit" className="login-btn">
                <div className="login-btn-styled">Login</div>
              </button>
            </div>

            {loginAttempted &&
              errorMessage && ( // Show error message if login attempted
                <div
                  className="flex text-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-3 rounded relative"
                  role="alert"
                >
                  <span className="block">{errorMessage}</span>
                </div>
              )}
            {loginAttempted &&
              successMessage && ( // Show success message if login attempted
                <div
                  className="flex text-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-3 rounded relative"
                  role="alert"
                >
                  <span className="block">{successMessage}</span>
                </div>
              )}

            <div className="txt-align">
              <span className="forgot-pw">
                <button type="button" onClick={handleForgotPasswordClick}>
                  Forgot password
                </button>
              </span>
            </div>

            <div className="other-method">
              <div className="txt-or">or</div>
              <hr />
            </div>
            <div className="other-method">
              <div className="other-login">
                <div className="content-method">
                  <button
                    type="button"
                    className="register"
                    onClick={handleRegisterClick}
                  >
                    Create account
                  </button>
                </div>
              </div>
            </div>
            <div className="other-login">
              <div className="logo-method">
                <img
                  src={images["google.jpg"]}
                  alt="Google"
                  width="45"
                  height="45"
                />
              </div>
              <div className="content-method">
                <span>Continue with Google</span>
              </div>
              <i
                className="fa-solid fa-angle-right"
                style={{ color: "rgb(153, 153, 153)" }}
              ></i>
            </div>
          </form>
        </div>
      </div>
      {showForgotPasswordForm && (
        <ForgotPasswordModal
          isOpen={showForgotPasswordForm}
          onClose={() => setForgotPasswordOpen(false)}
          onNext={(email) => handleForgotPasswordNext(email)}
        />
      )}

      {step === "code" && <ForgotPasswordCode email={email} />}
      {showRegisterForm && (
        <Register onClose={() => setShowRegisterForm(false)} />
      )}
    </div>
  );
}
