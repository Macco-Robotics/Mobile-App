import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from './context/themeContext'; // ajusta ruta si es necesario

type Drink = {
  _id: string;
  name: string;
  description?: string;
  image: string;
  type: 'Cóctel' | 'Smoothie' | 'Infusión' | 'Zumo' | 'Bebida energética' | 'Refresco';
  ingredients: {
    ingredient: {
      name: string;
    };
    quantity: number;
  }[];
  creator?: {
    name: string;
    surname?: string;
  };
  likes: number;
  isPublic: boolean;
  createdAt?: string;
};

export default function CreatedSavedDrinks() {
  const { colors } = useTheme();

  const { type } = useLocalSearchParams(); // 'created' or 'saved'
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [filtered, setFiltered] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [sortAZ, setSortAZ] = useState(false);

  const fetchDrinks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = type === 'saved' ? '/api/drink/me/saved' : '/api/drink/me/created';
      const response = await axios.get(`http://localhost:3000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrinks(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error('Error al cargar bebidas:', error);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, [type]);

  useEffect(() => {
    applyFilter();
  }, [search, sortAZ, drinks]);

  const applyFilter = () => {
    let data = [...drinks];
    const s = search.toLowerCase();

    if (s) {
      data = data.filter(drink =>
        drink.name.toLowerCase().includes(s) ||
        drink.type.toLowerCase().includes(s) ||
        drink.ingredients.some(i => i.ingredient.name.toLowerCase().includes(s))
      );
    }

    if (sortAZ) {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(data);
  };

  const renderItem = ({ item }: { item: Drink }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.text}>Tipo: {item.type}</Text>
      <Text style={styles.text}>
        Ingredientes: {item.ingredients.map(i => `${i.ingredient.name} (${i.quantity})`).join(', ')}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchInput: {
      backgroundColor: colors.card,
      margin: 16,
      padding: 10,
      borderRadius: 8,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortButton: {
      alignItems: 'center',
      marginBottom: 10,
    },
    sortText: {
      color: colors.placeholder,
      fontSize: 14,
    },
    listContent: {
      paddingHorizontal: 16,
    },
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    text: {
      color: colors.placeholder,
      fontSize: 14,
      marginBottom: 2,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre, tipo o ingrediente..."
        placeholderTextColor={colors.placeholder}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity onPress={() => setSortAZ(prev => !prev)} style={styles.sortButton}>
        <Text style={styles.sortText}>{sortAZ ? 'Orden: A-Z' : 'Orden: Original'}</Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
