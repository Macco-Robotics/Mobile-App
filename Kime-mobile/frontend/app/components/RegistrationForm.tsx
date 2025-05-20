import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface RegistrationFormProps {
  onRegistrationComplete: () => void; // Define la prop
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationComplete }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    direccion: "",
    codigoPostal: "",
  });

  const onChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    console.log("Form submitted:", form);
    onRegistrationComplete(); // Llama a la función pasada como prop
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* Icono circular superpuesto */}
        <View style={styles.avatarCircle}>
          <FontAwesome5 name="user" size={36} color="#0F7C99" />
          <View style={styles.cameraIcon}>
            <FontAwesome5 name="camera" size={16} color="#0F7C99" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          {[
            { label: "Nombre", field: "nombre", placeholder: "Marta" },
            { label: "Apellidos", field: "apellidos", placeholder: "López Ruiz" },
            { label: "Email", field: "email", placeholder: "SampleDomain" },
            { label: "Contraseña", field: "password", placeholder: "••••••••", secure: true },
            { label: "Dirección", field: "direccion", placeholder: "Calle Sierpes, nº10" },
            { label: "Código Postal", field: "codigoPostal", placeholder: "41004" },
          ].map(({ label, field, placeholder, secure }) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#A9C8D9"
                secureTextEntry={secure}
                value={form[field]}
                onChangeText={(text) => onChange(field, text)}
              />
            </View>
          ))}
        </ScrollView>

        {/* Botón de Registrar */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    justifyContent: "center",
    paddingHorizontal: 20, // margen lateral
  },
  card: {
    backgroundColor: "#CAF0F8",
    width: "100%", // ocupa todo el ancho menos el padding horizontal del container
    maxHeight: "85%",
    maxWidth: 900, // opcional para que no sea muy ancho en pantallas grandes
    borderRadius: 20,
    paddingTop: 60,
    paddingHorizontal: 55,
    paddingBottom: 25,
    position: "relative",
    shadowColor: "transparent",
    elevation: 0,
  },
  avatarCircle: {
    backgroundColor: "#E0F7FA",
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    top: -40,
    alignSelf: "center", // Centra el círculo automáticamente dentro del contenedor
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "transparent",
    elevation: 0,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#CAF0F8",
    borderRadius: 12,
    padding: 2,
    borderWidth: 0,
    borderColor: "transparent",
  },
  form: {
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#0F7C99",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F7C99",
    shadowColor: "transparent",
    elevation: 0,
    borderWidth: 0,
    width: "100%", // Aumenta el ancho de los inputs al 95% del contenedor
    alignSelf: "center", // Centra los inputs dentro del contenedor
  },
  button: {
    backgroundColor: "#0F7C99",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegistrationForm;
