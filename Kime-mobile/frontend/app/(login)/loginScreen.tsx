import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token');

      const res = await fetch('http://localhost:3000/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        Alert.alert('Sesión expirada', 'Por favor inicia sesión de nuevo');
        await AsyncStorage.removeItem('token');
        router.replace('/login');
        return;
      }
      if (!res.ok) throw new Error('Error al obtener perfil');
      const data = await res.json();
      setUser(data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00B7EB" style={{ marginTop: 50 }} />;
  }

  if (!user) {
    return <Text style={styles.errorText}>No se pudo cargar el perfil</Text>;
  }

  const InfoItem = ({ label, value }: { label: string; value: string | boolean | string[] }) => (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{Array.isArray(value) ? value.join(', ') : value?.toString()}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>

      <InfoItem label="Nombre de usuario" value={user.user} />
      <InfoItem label="Nombre" value={user.name} />
      <InfoItem label="Apellidos" value={user.surname} />
      <InfoItem label="Email" value={user.email} />
      <InfoItem label="Teléfono" value={user.phone_number} />
      <InfoItem label="Código Postal" value={user.postal_code} />
      <InfoItem label="Descripción" value={user.description || 'N/A'} />

      <Text style={styles.subtitle}>Preferencias</Text>
      <InfoItem label="Sabores preferidos" value={user.questionnaire?.flavourPreferences || []} />
      <InfoItem label="Restricción de alcohol" value={user.questionnaire?.alcoholRestriction} />
      <InfoItem label="Preferencia por cafeína" value={user.questionnaire?.caffeinePreferences} />
      <InfoItem label="Nivel de actividad física" value={user.questionnaire?.physicalActivityLevel} />
      <InfoItem label="Motivación al ordenar" value={user.questionnaire?.orderMotivation} />
      <InfoItem label="¿Desea notificaciones?" value={user.questionnaire?.wantsNotifications ? 'Sí' : 'No'} />
      <InfoItem label="Tipos de notificación" value={user.questionnaire?.notificationTypes || []} />

      <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#001F3F',
    flexGrow: 1,
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
  infoItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#A9D6E5',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  editButton: {
    marginTop: 30,
    backgroundColor: '#A9D6E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
