// app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { authEvents } from "../utils/authEvents";
import Navbar from "./navbar"; // ajusta la ruta si es necesario

export default function RootLayout() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLogged(!!token);
  };
  
  // Esta función se ejecuta cada vez que esta pantalla es visible
  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [])
  );

  useEffect(() => {
    authEvents.on("authChange", checkToken);
    return () => {
      authEvents.off("authChange", checkToken);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Aquí se renderiza la pantalla actual */}
      <Slot />
      {/* Navbar manual */}
      {isLogged && <Navbar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // o tu color de fondo
  },
});