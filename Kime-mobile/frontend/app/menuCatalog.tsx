import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { filterMenus } from "../utils/filterMenus";

type MenuItem = {
  _id: string;
  display_name: string;
  description: string;
  price_value: number;
  price_currency: string;
  type: string;
  recipe: { name: string; quantity: number; unit?: string }[];
};

export default function MenuCatalog() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const fetchMenuAndIngredients = async () => {
      try {
        const menuResponse = await fetch("http://localhost:3000/api/menu");
        const menuData = await menuResponse.json();
        setMenuItems(menuData);
        setFilteredItems(menuData);

        const uniqueTypes = Array.from(new Set(menuData.map((item: MenuItem) => item.type)));
      

        const ingredientsResponse = await fetch("http://localhost:3000/api/ingredients");
        const ingredientsData = await ingredientsResponse.json();
        const uniqueIngredients = ingredientsData.map((item: { name: string }) => item.name);
        setIngredients(uniqueIngredients);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndIngredients();
  }, []);

  useEffect(() => {
    const filtered = filterMenus(menuItems, searchText, selectedType, selectedIngredient);
    setFilteredItems(filtered);
  }, [menuItems, searchText, selectedType, selectedIngredient]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedType("");
    setSelectedIngredient("");
    setFilteredItems(menuItems);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log("Pressed:", item.display_name)}
    >
      <Text style={styles.name}>{item.display_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>
        {item.price_value} {item.price_currency}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#001F3F" }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar en el catálogo..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Picker
        selectedValue={selectedType}
        onValueChange={(value) => setSelectedType(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todos los tipos" value="" />
        {types.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedIngredient}
        onValueChange={(value) => setSelectedIngredient(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todos los ingredientes" value="" />
        {ingredients.map((ingredient) => (
          <Picker.Item key={ingredient} label={ingredient} value={ingredient} />
        ))}
      </Picker>

      <View style={styles.clearFiltersContainer}>
        <Button title="Limpiar filtros" onPress={clearFilters} />
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>
            No se han encontrado resultados para tu búsqueda.
          </Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  picker: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  card: {
    flex: 1,
    padding: 15,
    margin: 10,
    backgroundColor: "#003366",
    borderRadius: 8,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "bold",
    textAlign: "center",
  },
  clearFiltersContainer: {
    margin: 10,
  },
  list: {
    paddingBottom: 20,
  },
});
