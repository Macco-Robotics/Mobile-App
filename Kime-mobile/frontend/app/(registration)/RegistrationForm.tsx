import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";

// Debes definir aquí tus flags y países (ajusta rutas y contenido)
const flags: Record<string, any> = {
  ES: require("../../images/es.png"),
  IT: require("../../images/it.png"),
  AL: require("../../images/al.png"),
  PT: require("../../images/pt.png"),
  BE: require("../../images/be.png"),
  NL: require("../../images/nl.png"),
  US: require("../../images/us.png"),
  IN: require("../../images/in.webp"),
  JP: require("../../images/jp.png"),
};
const countries = [
  { code: "IT", name: "Italia", callingCode: "39" },
  { code: "AL", name: "Albania", callingCode: "355" },
  { code: "ES", name: "España", callingCode: "34" },
  { code: "PT", name: "Portugal", callingCode: "351" },
  { code: "BE", name: "Bélgica", callingCode: "32" },
  { code: "NL", name: "Holanda", callingCode: "31" },
  { code: "US", name: "Estados Unidos", callingCode: "1" },
  { code: "IN", name: "India", callingCode: "91" },
  { code: "JP", name: "Japón", callingCode: "81" },
];

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
  image: "",
};

const validateFormData = (formData: typeof initialFormData) => {
  const errors: Partial<Record<keyof typeof initialFormData, string>> = {};

  if (!formData.user) errors.user = "El nombre de usuario es requerido";
  if (!formData.email) errors.email = "El email es requerido";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Email inválido";
  if (!formData.password) errors.password = "La contraseña es requerida";
  if (!formData.phone) errors.phone = "El teléfono es requerido";

  return errors;
};

type RegistrationFormProps = {
  onRegistrationComplete: (data: typeof initialFormData & { phone: string }) => void;
  userData?: typeof initialFormData;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegistrationComplete,
  userData,
}) => {
  const { colors } = useTheme();

  const [formData, setFormData] = useState(userData || initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});
  const [selectedCountry, setSelectedCountry] = useState(countries[2]); // España por defecto
  const [showCountries, setShowCountries] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "stretch",
      padding: 20,
      backgroundColor: colors.background,
    },
    formContainer: {
      width: "100%",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
      alignSelf: "center",
    },
    photoSection: {
      alignItems: "center",
      marginBottom: 25,
    },
    photoCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    cameraIconContainer: {
      marginTop: 10,
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      color: colors.text,
      backgroundColor: colors.card,
      marginBottom: 15,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: "bold",
      fontSize: 16,
    },
    errorText: {
      color: "#FF6B6B",
      marginTop: -10,
      marginBottom: 10,
      fontSize: 14,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    prefixContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
    },
    prefixText: {
      color: colors.text,
      marginLeft: 6,
    },
    flag: {
      width: 24,
      height: 16,
      resizeMode: "contain",
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginTop: 5,
    },
    countryItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    countryText: {
      color: colors.text,
      marginLeft: 10,
    },
  });

  const handleChange = (name: keyof typeof initialFormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = () => {
    const newErrors = validateFormData(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onRegistrationComplete({
      ...formData,
      phone: `+${selectedCountry.callingCode}${formData.phone}`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <View style={styles.photoSection}>
          <View style={styles.photoCircle}>
            {formData.image ? (
              <Image source={{ uri: formData.image }} style={styles.photoCircle} />
            ) : null}
          </View>
          <TouchableOpacity style={styles.cameraIconContainer} activeOpacity={0.7}>
            <MaterialIcons name="photo-camera" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor={colors.placeholder}
          value={formData.user}
          onChangeText={(value) => handleChange("user", value)}
        />
        {errors.user && <Text style={styles.errorText}>{errors.user}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor={colors.placeholder}
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          placeholderTextColor={colors.placeholder}
          value={formData.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.placeholder}
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Dirección"
          placeholderTextColor={colors.placeholder}
          value={formData.address}
          onChangeText={(value) => handleChange("address", value)}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Código postal"
          placeholderTextColor={colors.placeholder}
          value={formData.postalCode}
          onChangeText={(value) => handleChange("postalCode", value)}
          keyboardType="numeric"
        />
        {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}

        {/* Teléfono con prefijo */}
        <View style={{ marginBottom: 15 }}>
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.prefixContainer}
              onPress={() => setShowCountries(!showCountries)}
              activeOpacity={0.7}
            >
              <Image source={flags[selectedCountry.code]} style={styles.flag} />
              <Text style={styles.prefixText}>+{selectedCountry.callingCode}</Text>
              <MaterialIcons
                name={showCountries ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={20}
                color={colors.text}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 10 }]}
              placeholder="Teléfono"
              placeholderTextColor={colors.placeholder}
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
            />
          </View>
          {showCountries && (
            <View style={styles.dropdownContainer}>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator
                nestedScrollEnabled
                style={{ maxHeight: 150 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountries(false);
                    }}
                  >
                    <Image source={flags[item.code]} style={styles.flag} />
                    <Text style={styles.countryText}>
                      {item.name} (+{item.callingCode})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor={colors.placeholder}
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegistrationForm;
