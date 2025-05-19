import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import RegistrationForm from "./components/RegistrationForm";
import PersonalizationScreen from "./components/PersonalizationScreen";

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
