import { authEvents } from '@/utils/authEvents';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Header from './header'; // ✅ Asegúrate de que la ruta sea correcta

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
    <View style={styles.card} key={field}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>{label}</Text>
        <TouchableOpacity onPress={() => toggleEdit(field)}>
          <Feather
            name="edit"
            size={18}
            color={editableFields[field] ? '#39adbe' : '#071e41'}
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
      <Text style={{ marginTop: 50, textAlign: 'center', color: '#071e41' }}>
        Cargando...
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header con logo ya integrado */}
      <Header />

      {/* Foto de perfil */}
      <View style={styles.photoContainer}>
        <View style={styles.photoCircle}></View>
        <TouchableOpacity style={styles.cameraButton} onPress={() => {}}>
          <Feather name="camera" size={24} color="#071e41" />
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
    backgroundColor: '#ccebf3',
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
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#071e41',
  },
  cameraButton: {
    marginTop: 10,
    backgroundColor: '#39adbe',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#39adbe',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#071e41',
    fontSize: 14,
  },
  cardInput: {
    color: '#000',
    paddingVertical: 4,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#39adbe',
    padding: 15,
    borderRadius: 10,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
