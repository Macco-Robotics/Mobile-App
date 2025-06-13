import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from './context/themeContext'; // Ajusta según la ruta real

type Drink = {
  _id: string;
  name: string;
  type: string;
  isPublic: boolean;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  ingredients: { ingredient: { name: string }; quantity: number }[];
  creator: { name: string };
};

export default function PublicDrinksScreen() {
  const { colors } = useTheme();

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [filtered, setFiltered] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'likes'>('name');

  const fetchPublicDrinks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/drink/published', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrinks(response.data);
      setFiltered(response.data);
    } catch (err) {
      console.error('Error al cargar bebidas públicas:', err);
    }
  };

  useEffect(() => {
    fetchPublicDrinks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, sortOption, drinks]);

  const applyFilters = () => {
    let data = [...drinks];

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        d =>
          d.name.toLowerCase().includes(s) ||
          d.type.toLowerCase().includes(s) ||
          d.ingredients.some(i => i.ingredient.name.toLowerCase().includes(s))
      );
    }

    if (sortOption === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'likes') {
      data.sort((a, b) => b.likes - a.likes);
    }

    setFiltered(data);
  };

  const likeDrink = async (drinkId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/drink/${drinkId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPublicDrinks();
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const saveDrink = async (drinkId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/drink/${drinkId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPublicDrinks();
    } catch (err) {
      console.error('Error al guardar bebida:', err);
    }
  };

  const renderItem = ({ item }: { item: Drink }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.text}>Tipo: {item.type}</Text>
      <Text style={styles.text}>Autor: {item.creator?.name || 'Desconocido'}</Text>
      <Text style={styles.text}>
        Ingredientes: {item.ingredients.map(i => `${i.ingredient.name} (${i.quantity})`).join(', ')}
      </Text>
      <Text style={styles.likes}>❤️ {item.likes}</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => likeDrink(item._id)}>
          <Icon
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={colors.likeIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => saveDrink(item._id)}>
          <Icon
            name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={colors.saveIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      margin: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 8,
    },
    sortButton: {
      marginHorizontal: 10,
    },
    sortText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    sortSelected: {
      fontWeight: 'bold',
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    text: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 2,
    },
    likes: {
      color: colors.success,
      marginTop: 6,
      marginBottom: 8,
      fontWeight: '600',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      width: 60,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre o ingrediente..."
        placeholderTextColor={colors.placeholder}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSortOption('name')} style={styles.sortButton}>
          <Text style={[styles.sortText, sortOption === 'name' && styles.sortSelected]}>
            A-Z
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('likes')} style={styles.sortButton}>
          <Text style={[styles.sortText, sortOption === 'likes' && styles.sortSelected]}>
            Más Likes
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
