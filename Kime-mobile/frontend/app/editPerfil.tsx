import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Switch, Button,
  ScrollView, StyleSheet, Alert
} from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

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
  name: string;
  surname: string;
  email: string;
  postal_code: string;
  phone_number: string;
  description: string;
  questionnaire: Questionnaire;
};

type RootStackParamList = {
  EditarPerfil: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'EditarPerfil'>;

export default function EditarPerfil({ route, navigation }: Props) {
  const { userId } = route.params;
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    axios.get<User>(`https://tu-api.com/users/${userId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = () => {
    if (!data) return;
    axios.put(`https://tu-api.com/users/${userId}`, data)
      .then(() => {
        Alert.alert('Perfil actualizado');
        navigation.goBack();
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error al guardar');
      });
  };

  if (!data) return <Text>Cargando para editar...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Campos básicos */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={data.name}
        onChangeText={name => setData({ ...data, name })}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={data.surname}
        onChangeText={surname => setData({ ...data, surname })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={data.email}
        onChangeText={email => setData({ ...data, email })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Código postal"
        value={data.postal_code}
        onChangeText={postal_code => setData({ ...data, postal_code })}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={data.phone_number}
        onChangeText={phone_number => setData({ ...data, phone_number })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={data.description}
        onChangeText={description => setData({ ...data, description })}
        multiline
        numberOfLines={3}
      />

      {/* Cuestionario: ejemplo para alcoholRestriction */}
      <Text style={styles.label}>Restricción de alcohol</Text>
      <Picker
        selectedValue={data.questionnaire.alcoholRestriction}
        onValueChange={value =>
          setData({
            ...data,
            questionnaire: { ...data.questionnaire, alcoholRestriction: value }
          })
        }
      >
        {[
          "I don't drink alcohol",
          "I prefer low-alcohol drinks",
          "I have no restrictions"
        ].map(opt => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>

      {/* Similarmente agrega Pickers para caffeinePreferences, physicalActivityLevel, orderMotivation */}

      <View style={styles.switchRow}>
        <Text style={styles.label}>¿Quieres notificaciones?</Text>
        <Switch
          value={data.questionnaire.wantsNotifications}
          onValueChange={wantsNotifications =>
            setData({
              ...data,
              questionnaire: { ...data.questionnaire, wantsNotifications }
            })
          }
        />
      </View>

      {/* Si quiere notifs, muestra opciones multilple-select (por simplicidad, checkboxes) */}
      {data.questionnaire.wantsNotifications && (
        <>
          <Text style={styles.label}>Tipos de notificación</Text>
          {['Promotions', 'Events', 'Recommendations', 'New drinks'].map(type => (
            <View style={styles.switchRow} key={type}>
              <Text>{type}</Text>
              <Switch
                value={data.questionnaire.notificationTypes.includes(type)}
                onValueChange={on => {
                  let arr = [...data.questionnaire.notificationTypes];
                  if (on) arr.push(type);
                  else arr = arr.filter(t => t !== type);
                  setData({
                    ...data,
                    questionnaire: { ...data.questionnaire, notificationTypes: arr }
                  });
                }}
              />
            </View>
          ))}
        </>
      )}

      <Button title="Guardar cambios" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    padding: 8, marginBottom: 12
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600' },
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginVertical: 8
  }
});
