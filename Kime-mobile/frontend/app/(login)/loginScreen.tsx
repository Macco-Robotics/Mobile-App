import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/themeContext"; // Ajusta según corresponda

type LoginScreenProps = {
  onLoginSuccess: (token: string) => void;
  onGoToRegister: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const { colors } = useTheme();

  const [userOrEmail, setUserOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userOrEmail || !password) {
      Alert.alert("Error", "Por favor ingresa usuario/email y contraseña");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userOrEmail,
          password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        onLoginSuccess(result.token);
        await AsyncStorage.setItem("token", result.token);
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

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 30,
    },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      color: colors.text,
      backgroundColor: colors.card, // color suave para input
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      width: "100%",
      marginBottom: 20,
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: "bold",
      fontSize: 16,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
    },
    footerText: {
      color: colors.text,
      fontSize: 14,
    },
    linkText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "bold",
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario o Email"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        value={userOrEmail}
        onChangeText={setUserOrEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Cargando..." : "Entrar"}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={onGoToRegister}>
          <Text style={styles.linkText}> Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
