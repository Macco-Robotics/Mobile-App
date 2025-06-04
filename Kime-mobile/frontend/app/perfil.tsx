import { authEvents } from '@/utils/authEvents';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const EditPerfil = () => {
  const [form, setForm] = useState<any>(null);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  const router = useRouter();

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

        // Inicializamos editableFields en false para que no estén editables al cargar
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
      [field]: true, // Solo habilitamos edición al darle al lápiz, nunca deshabilitamos aquí
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
    <View style={styles.card} key={field}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>{label}</Text>
        <TouchableOpacity onPress={() => toggleEdit(field)}>
          <Feather
            name="edit"
            size={18}
            color={editableFields[field] ? '#007BFF' : '#003366'}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.cardInput}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={form?.[field] || ''}
        editable={!!editableFields[field]}
        onChangeText={(v) => handleChange(field, v)}
      />
    </View>
  );

  if (!form) {
    return (
      <Text style={{ marginTop: 50, textAlign: 'center', color: 'white' }}>
        Cargando...
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Foto perfil */}
      <View style={styles.photoContainer}>
        <View style={styles.photoCircle}>
          {/* Aquí podría ir la imagen real en el futuro */}
        </View>
        <TouchableOpacity style={styles.cameraButton} onPress={() => { /* más adelante */ }}>
          <Feather name="camera" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      {renderField('Nombre', 'name', 'Nombre')}
      {renderField('Apellidos', 'surname', 'Apellidos')}
      {renderField('Email', 'email', 'Correo electrónico')}
      {renderField('Teléfono', 'phone_number', 'Teléfono')}
      {renderField('Código Postal', 'postal_code', 'Código Postal')}
      {renderField('Dirección', 'description', 'Dirección')}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPerfil;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#001F3F',
    padding: 20,
    alignItems: 'center',
  },
  photoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DCEBFB',
    borderWidth: 2,
    borderColor: '#003366',
  },
  cameraButton: {
    marginTop: 10,
    backgroundColor: '#A9D6E5',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#DCEBFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#003366',
  },
  cardInput: {
    color: '#000',
    paddingVertical: 4,
  },
  button: {
    backgroundColor: '#A9D6E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 40,
    width: '100%',
  },
  buttonText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
