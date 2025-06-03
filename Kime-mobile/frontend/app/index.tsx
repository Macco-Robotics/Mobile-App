// index.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MenuCatalog from "./menuCatalog"; // Asegúrate de que la ruta sea correcta

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../images/logomacco.png")} // Asegúrate de que la ruta sea válida
        style={styles.logo}
        resizeMode="contain"
      />
      <MenuCatalog />
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
