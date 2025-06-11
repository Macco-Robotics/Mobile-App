import { authEvents } from "@/utils/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import LoginScreen from "./(login)/loginScreen";
import RegisterLoginController from "./(registration)/register-loginController";
import MenuCatalog from "./menuCatalog";
import Header from "./header";
import { Picker } from "@react-native-picker/picker"; 
import { Text } from "react-native"; 

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");


  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLogged(!!token);
      setLoading(false);
    };
    
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_DEPLOYMENT}/api/restaurants/slugs`);
        const data = await res.json();
        setSlugs(data);
        setSelectedSlug(data[0] || "");
      } catch (err) {
        console.error("Error al cargar slugs:", err);
      }
    };

    if (isLogged) {
      fetchSlugs();
    }
  }, [isLogged]);

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
        {/* 🔽 SELECTOR DE SLUGS */}
        <View style={{ padding: 10, backgroundColor: "#fff" }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Selecciona un restaurante
          </Text>
          <Picker
            selectedValue={selectedSlug}
            onValueChange={(itemValue) => setSelectedSlug(itemValue)}
          >
            {slugs.map((slug) => (
              <Picker.Item key={slug} label={slug} value={slug} />
            ))}
          </Picker>
        </View>

        {/* CONTENIDO PRINCIPAL */}
        <Header />
        <MenuCatalog selectedSlug={selectedSlug} />

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
