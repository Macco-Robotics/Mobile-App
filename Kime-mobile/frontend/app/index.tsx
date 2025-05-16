import React from "react";
import { StyleSheet, View, Image } from "react-native";
import RegistrationForm from "./components/RegistrationForm";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Logo de Macco */}
        <Image
          source={require("../images/logomacco.png")} // Asegúrate de que el logo esté en la carpeta "assets"
          style={styles.logo}
          resizeMode="contain"
        />
        <RegistrationForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#001F3F", // Azul marino
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
    width: 200, // Ajusta el tamaño del logo
    height: 100,
    marginBottom: 20, // Espacio entre el logo y el formulario
  },
});