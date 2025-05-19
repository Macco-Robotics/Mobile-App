import React from "react";
import { StyleSheet, View, Image } from "react-native";
import App from "./app"; // importa el componente que maneja la navegación

export default function Page() {
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#001F3F",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
});
