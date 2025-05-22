// MenuCatalog.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type MenuItem = {
  _id: string;
  display_name: string;
  description: string;
  price_value: number;
  price_currency: string;
};

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * (numColumns + 1)) / numColumns;
const cardHeight = 200;

export default function MenuCatalog() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Todos los elementos del menú
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]); // Elementos filtrados
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Texto de búsqueda

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/menu");
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data); // Inicialmente, los elementos filtrados son todos los elementos
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filtrar los elementos del menú en función del texto de búsqueda
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === "") {
      setFilteredItems(menuItems); // Si no hay texto, muestra todos los elementos
    } else {
      const filtered = menuItems.filter((item) =>
        item.display_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.name} numberOfLines={1}>
        {item.display_name}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>
      <Text style={styles.price}>
        {item.price_value} {item.price_currency}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar en el catálogo..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Lista de elementos */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: cardMargin / 2,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#003366",
    borderRadius: 14,
    margin: cardMargin / 2,
    width: cardWidth,
    height: cardHeight,
    padding: 14,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  imagePlaceholder: {
    backgroundColor: "#123955",
    height: 70,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    marginVertical: 8,
    textAlign: "center",
    flexShrink: 1,
  },
  price: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    margin: 10,
    color: "#333",
  },
});
