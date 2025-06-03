// index.tsx
import React from "react";
import { StyleSheet } from "react-native";
import RegisterLoginController from "./(registration)/register-loginController";

export default function HomeScreen() {
  return <RegisterLoginController />;
    /*
    <View style={styles.container}>
      <Image
        source={require("../images/logomacco.png")} // Asegúrate de que la ruta sea válida
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Nuestras Bebidas</Text>
      <MenuCatalog />
    </View>
  ); */
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 60,
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
