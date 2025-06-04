import { authEvents } from "@/utils/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import LoginScreen from "./(login)/loginScreen";
import RegisterLoginController from "./(registration)/register-loginController";
import MenuCatalog from "./menuCatalog";

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
    authEvents.emit("authChange"); 

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
          <Image
            source={require("../images/logomacco.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <MenuCatalog />
        </>
      ) :showRegister? (
        <RegisterLoginController />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} onGoToRegister={handleGoToRegister}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9ef",
    paddingTop: 20,
  },
  logo: {
    width: 300, // Aumenta el ancho
    height: 100, // Aumenta la altura
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
});