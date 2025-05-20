import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './components/LoginScreen';
import RegistrationForm from './components/RegistrationForm';
import PersonalizationScreen from './components/PersonalizationScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'personalization'>('login');

  const handleRegisterPress = () => {
    setCurrentScreen('register');
  };

  const handleRegistrationComplete = () => {
    setCurrentScreen('personalization');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'login' && (
        <LoginScreen onRegisterPress={handleRegisterPress} />
      )}
      {currentScreen === 'register' && (
        <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
      )}
      {currentScreen === 'personalization' && <PersonalizationScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00133C',  // Fondo azul oscuro general
  },
});
