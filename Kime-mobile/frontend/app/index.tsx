import { authEvents } from "@/utils/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import LoginScreen from "./(login)/loginScreen";
import RegisterLoginController from "./(registration)/register-loginController";
import MenuCatalog from "./menuCatalog";
import Header from "./header";
import { useTheme } from "./context/themeContext";  // Ajusta la ruta según dónde tengas el context

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { colors } = useTheme();  // <--- Aquí obtienes los colores del tema actual

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
    authEvents.emit("authChange");
  };

  const handleGoToRegister = () => {
    setShowRegister(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    // elimina backgroundColor fijo aquí, ahora va dinámico en línea
  },
});
