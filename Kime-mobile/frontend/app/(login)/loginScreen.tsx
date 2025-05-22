import { useRouter } from "expo-router"; // Importa el hook
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import RegistrationForm from "../(registration)/RegistrationForm";

const LoginScreen: React.FC = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter(); // Inicializa el router

  // Handler para el segundo enlace de registro
  const onRegisterPress = () => setShowRegister(true);

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
        body: JSON.stringify({ user, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setToken(result.token);
        Alert.alert("Éxito", "Sesión iniciada correctamente");
        router.replace("/"); // Redirige al home
      } else {
        Alert.alert(
          "Error de autenticación",
          result.message || "Usuario o contraseña incorrectos"
        );
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
      <RegistrationForm
        onRegistrationComplete={() => setShowRegister(false)}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      keyboardShouldPersistTaps="handled"
    >
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Cargando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => setShowRegister(true)}>
          <Text style={styles.linkText}> Regístrate</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.registerText}>
        ¿No tienes una cuenta?{" "}
        <Text style={styles.registerLink} onPress={onRegisterPress}>
          Regístrate
        </Text>
      </Text>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#001F3F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#DCEBFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#00B7EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  footerText: {
    color: "#FFF",
  },
  linkText: {
    color: "#00B7EB",
    fontWeight: "bold",
  },
  registerText: {
    color: "#FFF",
    alignSelf: "center",
    marginTop: 10,
  },
  registerLink: {
    color: "#00B7EB",
    fontWeight: "bold",
  },
  // (si tenías estilos extra –cardContainer, label, social*, etc.–
  // puedes dejarlos aquí; no afectan al resto)
});
