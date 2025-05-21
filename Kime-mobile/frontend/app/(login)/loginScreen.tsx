import { useRouter } from "expo-router"; // Importa el hook
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RegistrationForm from "../(registration)/RegistrationForm";

const LoginScreen: React.FC = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter(); // Inicializa el router

  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert("Error", "Por favor ingresa tu usuario y contraseña");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          password: password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setToken(result.token);
        Alert.alert("Éxito", "Sesión iniciada correctamente");
        router.replace("/"); // Redirige al home
      } else {
        Alert.alert("Error de autenticación", result.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error de red o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <RegistrationForm onRegistrationComplete={() => setShowRegister(false)} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#A9D6E5"
        autoCapitalize="none"
        value={user}
        onChangeText={setUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A9D6E5"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cargando..." : "Entrar"}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => setShowRegister(true)}>
          <Text style={styles.linkText}> Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#001F3F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A9D6E5",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#A9D6E5",
    borderRadius: 5,
    color: "#FFFFFF",
    backgroundColor: "#002B5B",
  },
  button: {
    backgroundColor: "#A9D6E5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  linkText: {
    color: "#A9D6E5",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;
