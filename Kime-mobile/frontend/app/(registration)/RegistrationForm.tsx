import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RegistrationFormProps = {
  onRegistrationComplete: (data: any) => void;
};

const validateFormData = (formData: typeof initialFormData) => {
  const newErrors: Partial<Record<keyof typeof formData, string>> = {};

  if (!formData.user) {
    newErrors.user = "El nombre de usuario es obligatorio.";
  } else if (formData.user.length < 4 || formData.user.length > 20) {
    newErrors.user = "Debe tener entre 4 y 20 caracteres.";
  }

  if (!formData.name) {
    newErrors.name = "El nombre es obligatorio.";
  } else if (formData.name.length < 2 || formData.name.length > 30) {
    newErrors.name = "Debe tener entre 2 y 30 caracteres.";
  }

  if (!formData.lastName) {
    newErrors.lastName = "Los apellidos son obligatorios.";
  } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
    newErrors.lastName = "Debe tener entre 2 y 50 caracteres.";
  }

  if (!formData.email) {
    newErrors.email = "El correo electrónico es obligatorio.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }
  }

  if (!formData.password) {
    newErrors.password = "La contraseña es obligatoria.";
  } else if (formData.password.length < 6 || formData.password.length > 50) {
    newErrors.password = "Debe tener entre 6 y 50 caracteres.";
  }

  if (!formData.address) {
    newErrors.address = "La dirección es obligatoria.";
  } else if (formData.address.length < 5 || formData.address.length > 100) {
    newErrors.address = "Debe tener entre 5 y 100 caracteres.";
  }

  if (!formData.postalCode) {
    newErrors.postalCode = "El código postal es obligatorio.";
  } else if (formData.postalCode.length < 5 || formData.postalCode.length > 10) {
    newErrors.postalCode = "Debe tener entre 5 y 10 caracteres.";
  }

  if (!formData.phone) {
    newErrors.phone = "El teléfono es obligatorio.";
  } else {
    const phoneRegex = /^\d{9,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Debe tener entre 9 y 15 dígitos numéricos.";
    }
  }

  return newErrors;
};

const initialFormData = {
  user: "",
  name: "",
  lastName: "",
  email: "",
  password: "",
  address: "",
  postalCode: "",
  phone: "",
  description: "",
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = () => {
    const newErrors = validateFormData(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onRegistrationComplete(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#A9D6E5"
          value={formData.user}
          onChangeText={(value) => handleChange("user", value)}
        />
        {errors.user && <Text style={styles.errorText}>{errors.user}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#A9D6E5"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          placeholderTextColor="#A9D6E5"
          value={formData.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A9D6E5"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#A9D6E5"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Dirección"
          placeholderTextColor="#A9D6E5"
          value={formData.address}
          onChangeText={(value) => handleChange("address", value)}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Código Postal"
          placeholderTextColor="#A9D6E5"
          value={formData.postalCode}
          onChangeText={(value) => handleChange("postalCode", value)}
        />
        {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#A9D6E5"
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

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
    alignItems: "stretch", // Permite que los hijos ocupen todo el ancho
    padding: 20,
    backgroundColor: "#001F3F",
  },
  formContainer: {
    width: "100%", // Asegura que el View padre llene el ancho
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
  errorText: {
    color: "#FF6B6B",
    marginTop: -10,
    marginBottom: 10,
    fontSize: 14,
  },
});

export default RegistrationForm;
