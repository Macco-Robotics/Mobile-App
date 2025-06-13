import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "./context/themeContext"; // Ajusta según la ruta

export default function Header() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.background, // Usamos un color del tema para fondo
      paddingTop: 40,
      paddingBottom: 10,
      alignItems: "center",
    },
    logo: {
      width: 330,
      height: 120,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../images/logomacco.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}
