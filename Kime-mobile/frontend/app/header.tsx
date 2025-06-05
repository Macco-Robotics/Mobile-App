import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Header() {
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

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#cae9ef", // Color principal de fondo
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 330,
    height: 120,
  },
});
