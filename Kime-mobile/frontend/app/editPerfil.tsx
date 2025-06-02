import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EditPerfil = () => {
  const [form, setForm] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setForm(data);
    };
    loadProfile();
  }, []);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('questionnaire.')) {
      const key = field.split('.')[1];
      setForm((prev: any) => ({
        ...prev,
        questionnaire: {
          ...prev.questionnaire,
          [key]: value
        }
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const completedForm = {
        ...form,
        questionnaire: {
          ...form.questionnaire,
          alcoholRestriction: form.questionnaire?.alcoholRestriction || "I have no restrictions",
          caffeinePreferences: form.questionnaire?.caffeinePreferences || "Only small amounts",
          physicalActivityLevel: form.questionnaire?.physicalActivityLevel || "Moderate",
          orderMotivation: form.questionnaire?.orderMotivation || "Depends",
        },
      };

      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completedForm),
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

  if (!form) return <Text style={{ marginTop: 50, textAlign: 'center', color: 'white' }}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={form.name || ''} onChangeText={(v) => handleChange('name', v)} />
      <TextInput style={styles.input} placeholder="Apellidos" value={form.surname || ''} onChangeText={(v) => handleChange('surname', v)} />
      <TextInput style={styles.input} placeholder="Email" value={form.email || ''} onChangeText={(v) => handleChange('email', v)} />
      <TextInput style={styles.input} placeholder="Teléfono" value={form.phone_number || ''} onChangeText={(v) => handleChange('phone_number', v)} />
      <TextInput style={styles.input} placeholder="Código Postal" value={form.postal_code || ''} onChangeText={(v) => handleChange('postal_code', v)} />
      <TextInput style={styles.input} placeholder="Descripción" value={form.description || ''} onChangeText={(v) => handleChange('description', v)} />

      <Text style={styles.subtitle}>Preferencias</Text>
      <TextInput style={styles.input} placeholder="Café" value={form.questionnaire?.caffeinePreferences || ''} onChangeText={(v) => handleChange('questionnaire.caffeinePreferences', v)} />
      <TextInput style={styles.input} placeholder="Alcohol" value={form.questionnaire?.alcoholRestriction || ''} onChangeText={(v) => handleChange('questionnaire.alcoholRestriction', v)} />
      <TextInput style={styles.input} placeholder="Actividad física" value={form.questionnaire?.physicalActivityLevel || ''} onChangeText={(v) => handleChange('questionnaire.physicalActivityLevel', v)} />
      <TextInput style={styles.input} placeholder="Motivación" value={form.questionnaire?.orderMotivation || ''} onChangeText={(v) => handleChange('questionnaire.orderMotivation', v)} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A9D6E5',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A9D6E5',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#DCEBFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#000',
  },
  button: {
    backgroundColor: '#A9D6E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
