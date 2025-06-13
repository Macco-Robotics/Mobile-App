import { authEvents } from '@/utils/authEvents';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from './header';
import { useTheme } from './context/themeContext';

const themeOptions = [
  { key: "blue", color: "#7ec8e3" }, // Más claro
  { key: "dark", color: "#071e41" },
  { key: "light", color: "#ffffff" },
  { key: "green", color: "#4caf50" },
  { key: "purple", color: "#9c27b0" },
] as const;

const EditPerfil = () => {
  const [form, setForm] = useState<any>(null);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { theme, setTheme, colors } = useTheme();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setForm(data);

        const initialEditable: Record<string, boolean> = {};
        Object.keys(data).forEach((key) => {
          initialEditable[key] = false;
        });
        setEditableFields(initialEditable);
      } catch (err) {
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    };
    loadProfile();
  }, []);

  const toggleEdit = (field: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.replace('/perfil');
      } else {
        const error = await res.json();
        Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      authEvents.emit('authChange');
      router.replace('/');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  }

  const renderField = (label: string, field: string, placeholder: string) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]} key={field}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardLabel, { color: colors.text }]}>{label}</Text>
        <TouchableOpacity onPress={() => toggleEdit(field)}>
          <Feather
            name="edit"
            size={18}
            color={editableFields[field] ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.cardInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={form?.[field] || ''}
        editable={!!editableFields[field]}
        onChangeText={(v) => handleChange(field, v)}
      />
    </View>
  );

  if (!form) {
    return (
      <Text style={{ marginTop: 50, textAlign: 'center', color: colors.text }}>
        Cargando...
      </Text>
    );
  }
  console.log("theme actual:", theme);
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      {/* Foto de perfil */}
      <View style={styles.photoContainer}>
        <View style={[styles.photoCircle, { backgroundColor: colors.white, borderColor: colors.text }]}></View>
        <TouchableOpacity
          style={[styles.cameraButton, { backgroundColor: colors.primary }]}
          onPress={() => {}}>
          <Feather name="camera" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {renderField('Nombre', 'name', 'Nombre')}
      {renderField('Apellidos', 'surname', 'Apellidos')}
      {renderField('Email', 'email', 'Correo electrónico')}
      {renderField('Teléfono', 'phone_number', 'Teléfono')}
      {renderField('Código Postal', 'postal_code', 'Código Postal')}
      {renderField('Dirección', 'description', 'Dirección')}

      {/* Selector de tema después de los campos */}
      <Text style={{ fontWeight: "bold", color: colors.primary, marginTop: 10, marginBottom: 5, alignSelf: "flex-start" }}>
        Cambiar tema
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {themeOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setTheme(opt.key)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: opt.color,
              marginHorizontal: 6,
              borderWidth: theme === opt.key ? 3 : 1,
              borderColor: theme === opt.key ? colors.primary : "#071e41",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === opt.key && (
              <Feather name="check" size={18} color={opt.key === "light" ? "#071e41" : "#fff"} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.danger }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutButtonText, { color: colors.buttonText }]}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
};

export default EditPerfil;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  photoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  cameraButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardInput: {
    paddingVertical: 4,
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 40,
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});
