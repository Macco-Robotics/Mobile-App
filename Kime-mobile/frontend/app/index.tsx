// app/index.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import App from "./(registration)/register-loginController";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require("../images/logomacco.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <App />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 960,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
});
