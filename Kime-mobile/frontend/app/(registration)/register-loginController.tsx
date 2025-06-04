import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import PersonalizationScreen from "./personalizationScreen";

const RegisterLoginController = () => {
  const [step, setStep] = useState<"register" | "personalize">("register");
  const [userData, setUserData] = useState<any>(null);

  const handleRegistrationComplete = (data: any) => {
    setUserData(data);
    setStep("personalize");
  };

  const handleGoBack = () => {
    setStep("register");
  };

  return step === "register" ? (
    <RegistrationForm onRegistrationComplete={handleRegistrationComplete} userData={userData} />
  ) : (
    <PersonalizationScreen userData={userData} onGoBack={handleGoBack} />
  );
};

export default RegisterLoginController;
