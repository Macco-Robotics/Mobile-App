import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import PersonalizationScreen from "./components/PersonalizationScreen";
import RegistrationForm from "./components/RegistrationForm";

export default function App() {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    user: string,
    name: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    postalCode: string;
    phone: string;
    description: string;
  } | null>(null);

  return (
    <View style={styles.container}>
      {!registrationComplete ? (
        <RegistrationForm onRegistrationComplete={(data) => {
          setRegistrationData(data);
          setRegistrationComplete(true)
        }} />
      ) : (
        registrationData && (
          <PersonalizationScreen
            onGoBack={() => setRegistrationComplete(false)}
            userData={registrationData}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
