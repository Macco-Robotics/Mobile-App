import { useImageUpload } from "@/hooks/useImageUpload";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const flags: Record<string, any> = {
  IT: require("../../images/it.png"),
  AL: require("../../images/al.png"),
  ES: require("../../images/es.png"),
  PT: require("../../images/pt.png"),
  BE: require("../../images/be.png"),
  NL: require("../../images/nl.png"),
  US: require("../../images/us.png"),
  IN: require("../../images/in.webp"),
  JP: require("../../images/jp.png"),
};

const countries = [
  { code: "IT", callingCode: "39", name: "Italia" },
  { code: "AL", callingCode: "355", name: "Albania" },
  { code: "ES", callingCode: "34", name: "España" },
  { code: "PT", callingCode: "351", name: "Portugal" },
  { code: "BE", callingCode: "32", name: "Bélgica" },
  { code: "NL", callingCode: "31", name: "Holanda" },
  { code: "US", callingCode: "1", name: "Estados Unidos" },
  { code: "IN", callingCode: "91", name: "India" },
  { code: "JP", callingCode: "81", name: "Japón" },
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

type RegistrationFormProps = {
  onRegistrationComplete: (data: any) => void;
  userData?: typeof initialFormData;
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

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegistrationComplete,
  userData,
}) => {
  const [formData, setFormData] = useState(userData || initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [selectedCountry, setSelectedCountry] = useState(countries[2]); // España por defecto
  const [showCountries, setShowCountries] = useState(false);
  const {
    imageUri,
    cloudinaryUrl,
    uploading,
    pickImage,
    takePhoto
  } = useImageUpload();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (cloudinaryUrl) {
      setFormData((prev) => ({ ...prev, image: cloudinaryUrl }));
    }
  }, [cloudinaryUrl]);

  const handleImagePicker = () => {
    setModalVisible(true);
  };

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
    onRegistrationComplete({ ...formData, phone: `+${selectedCountry.callingCode}${formData.phone}` });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <View style={styles.photoContainer}>
          {(imageUri || cloudinaryUrl || formData?.image) ? (
            <Image
              source={{ uri: imageUri || cloudinaryUrl || formData.image }}
              style={styles.photoCircle}
            />
          ) : (
            <View style={styles.photoCircle} />
          )}

          <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
            <Feather name="camera" size={24} color="#071e41" />
          </TouchableOpacity>
        </View>

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
          keyboardType="email-address"
          autoCapitalize="none"
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
          keyboardType="numeric"
        />
        {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}

        {/* Teléfono con prefijo desplegable inline */}
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
                color="#A9D6E5"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 10 }]}
              placeholder="Teléfono"
              placeholderTextColor="#A9D6E5"
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
          placeholderTextColor="#A9D6E5"
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, uploading && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? "Subiendo imagen..." : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Subir foto</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                takePhoto();
              }}
            >
              <Text style={styles.modalOptionText}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                pickImage();
              }}
            >
              <Text style={styles.modalOptionText}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, { backgroundColor: '#ccc' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalOptionText, { color: '#333' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
    backgroundColor: "#001F3F",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A9D6E5",
    marginBottom: 20,
    alignSelf: "center",
  },
  photoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  photoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#002B5B",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cameraIconContainer: {
    marginTop: 10,
    backgroundColor: "#002B5B",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    marginTop: 10,
    backgroundColor: '#39adbe',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#A9D6E5",
    borderRadius: 8,
    color: "#FFFFFF",
    backgroundColor: "#002B5B",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#A9D6E5",
    padding: 15,
    borderRadius: 8,
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // si usas React Native >= 0.71, para separación entre prefijo y input
  },
  prefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: "#A9D6E5",
    borderRadius: 8,
    backgroundColor: "#002B5B",
    height: 42, // altura fija para igualar con input
    marginTop: -13,
  },
  flag: {
    width: 26,
    height: 18,
    resizeMode: "contain",
    marginRight: 6,
  },
  prefixText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#A9D6E5",
    borderRadius: 8,
    backgroundColor: "#002B5B",
    marginTop: 5,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  countryText: {
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#071e41',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#39adbe',
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationForm;
