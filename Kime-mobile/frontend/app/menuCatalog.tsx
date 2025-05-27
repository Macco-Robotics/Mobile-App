import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, // <-- añadido
} from "react-native";
import { useRouter } from "expo-router"; // <-- añadido

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // <-- añadido

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/menu");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/bebida/${item._id}`)} // <-- navegación añadida
    >
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
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={menuItems}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
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
});