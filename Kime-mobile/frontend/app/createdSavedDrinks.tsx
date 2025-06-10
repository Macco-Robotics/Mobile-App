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

// Tipo Drink compatible con frontend
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
  const { type } = useLocalSearchParams(); // 'created' or 'saved'
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [filtered, setFiltered] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [sortAZ, setSortAZ] = useState(false);

  const fetchDrinks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = type === 'saved' ? '/api/drink/me/saved' : '/api/drink/me/created';
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_DEPLOYMENT}${endpoint}`, {
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre, tipo o ingrediente..."
        placeholderTextColor="#aaa"
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  sortButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  sortText: {
    color: '#ccc',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
});
