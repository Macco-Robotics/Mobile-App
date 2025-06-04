import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import LoginScreen from "./(login)/loginScreen";
import RegisterLoginController from "./(registration)/register-loginController";
import MenuCatalog from "./menuCatalog";
import Header from "./header"; // 👈 Asegúrate de que la ruta sea correcta

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLogged(!!token);
      setLoading(false);
    };
    checkLogin();
  }, []);

  const handleLoginSuccess = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    setIsLogged(true);
  };

  const handleGoToRegister = () => {
    setShowRegister(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A9D6E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLogged ? (
        <>
          <Header />
          <MenuCatalog />
        </>
      ) : showRegister ? (
        <RegisterLoginController />
      ) : (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={handleGoToRegister}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9ef",
  },
});
