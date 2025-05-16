import React, { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import PersonalizationScreen from "./components/PersonalizationScreen";

const App = () => {
  const [currentView, setCurrentView] = useState("registration"); // Estado para controlar la vista

  const handleContinue = () => {
    setCurrentView("personalization"); // Cambia a la vista de personalización
  };

  return (
    <div className="App">
      {currentView === "registration" ? (
        <RegistrationForm onContinue={handleContinue} />
      ) : (
        <PersonalizationScreen />
      )}
    </div>
  );
};

export default App;