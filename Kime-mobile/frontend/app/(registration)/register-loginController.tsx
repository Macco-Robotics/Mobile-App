import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import RegistrationForm from "./RegistrationForm";
import PersonalizationScreen from "./personalizationScreen";

export default function App() {
  const [registrationComplete, setRegistrationComplete] = useState(false);

  return (
    <View style={styles.container}>
      {!registrationComplete ? (
        <RegistrationForm onRegistrationComplete={() => setRegistrationComplete(true)} />
      ) : (
        <PersonalizationScreen onGoBack={() => setRegistrationComplete(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
