import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPassword";
import ForgotPasswordCode from "./ForgotPasswordCode";

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");

  const handleNextStep = (enteredEmail) => {
    setEmail(enteredEmail);
    setStep("code");
  };

  return (
    <div>
      {step === "email" && (
        <ForgotPasswordModal
          isOpen={true}
          onNext={(enteredEmail) => handleNextStep(enteredEmail)}
        />
      )}
      {step === "code" && <ForgotPasswordCode email={email} />}
    </div>
  );
};

export default ForgotPassword;
