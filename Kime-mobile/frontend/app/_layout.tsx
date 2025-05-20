// app/_layout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from "./navbar";  // ajusta la ruta si es necesario

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Aquí se renderiza la pantalla actual */}
      <Slot />
      {/* Navbar manual */}
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // o tu color de fondo
  },
});