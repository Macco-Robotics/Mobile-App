import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// ✅ Declaramos el tipo de props que el componente espera
type RegistrationFormProps = {
    onRegistrationComplete: () => void;
  };
  
  const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    postalCode: "",
    phone: "",
    description: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = () => {
    // Aquí podrías hacer validaciones si quieres
    onRegistrationComplete(); // ✅ Llama al callback que te lleva a la pantalla de personalización
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Registro de Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#A9D6E5"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          placeholderTextColor="#A9D6E5"
          value={formData.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A9D6E5"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#A9D6E5"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          placeholderTextColor="#A9D6E5"
          value={formData.address}
          onChangeText={(value) => handleChange("address", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Código Postal"
          placeholderTextColor="#A9D6E5"
          value={formData.postalCode}
          onChangeText={(value) => handleChange("postalCode", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#A9D6E5"
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#A9D6E5"
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#A9D6E5",
    borderRadius: 5,
    color: "#FFFFFF",
    backgroundColor: "#002B5B",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#A9D6E5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegistrationForm;
