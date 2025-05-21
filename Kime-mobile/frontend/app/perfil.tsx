import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Questionnaire = {
  flavourPreferences: string[];
  alcoholRestriction: string;
  caffeinePreferences: string;
  physicalActivityLevel: string;
  orderMotivation: string;
  wantsNotifications: boolean;
  notificationTypes: string[];
};

type User = {
  _id: string;
  user: string;
  name: string;
  surname: string;
  email: string;
  postal_code: string;
  phone_number: string;
  image: string;
  role: 'owner' | 'user';
  description: string;
  questionnaire: Questionnaire;
};

type RootStackParamList = {
  Perfil: undefined;
  EditarPerfil: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function Perfil({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Sustituye '123' por el ID real, o recógelo de tu contexto/auth
    axios.get<User>('https://tu-api.com/user/johndoe')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return <Text>Cargando perfil...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.image ? (
        <Image source={{ uri: user.image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{user.name} {user.surname}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{user.description || '—'}</Text>

      <Text style={styles.sectionTitle}>Dirección</Text>
      <Text style={styles.text}>CP: {user.postal_code}</Text>
      <Text style={styles.text}>Teléfono: {user.phone_number}</Text>

      <Text style={styles.sectionTitle}>Cuestionario</Text>
      <Text style={styles.text}>Preferencias de sabor: {user.questionnaire.flavourPreferences.join(', ') || '—'}</Text>
      <Text style={styles.text}>Alcohol: {user.questionnaire.alcoholRestriction}</Text>
      <Text style={styles.text}>Cafeína: {user.questionnaire.caffeinePreferences}</Text>
      <Text style={styles.text}>Actividad física: {user.questionnaire.physicalActivityLevel}</Text>
      <Text style={styles.text}>Motivación: {user.questionnaire.orderMotivation}</Text>
      <Text style={styles.text}>
        Notificaciones: {user.questionnaire.wantsNotifications ? 'Sí' : 'No'}
      </Text>
      {user.questionnaire.wantsNotifications && (
        <Text style={styles.text}>
          Tipos: {user.questionnaire.notificationTypes.join(', ') || '—'}
        </Text>
      )}

      <Button
        title="Editar perfil"
        onPress={() => navigation.navigate('EditarPerfil', { userId: user._id })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  placeholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#666' },
  name: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  sectionTitle: { fontSize: 18, marginTop: 20, fontWeight: '600' },
  text: { fontSize: 16, marginTop: 4, textAlign: 'center' },
});
