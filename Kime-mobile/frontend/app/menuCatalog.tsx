import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { filterMenus } from "../utils/filterMenus";

const screenWidth = Dimensions.get("window").width;
const numColumns = 4;
const horizontalPadding = 18 * 2;
const marginBetweenCards = 8;
const cardWidth = (screenWidth - horizontalPadding - marginBetweenCards * (numColumns - 1)) / numColumns;

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
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchMenuAndIngredients = async () => {
      try {
        const menuResponse = await fetch("http://localhost:3000/api/menu");
        const menuData: MenuItem[] = await menuResponse.json();
        setMenuItems(menuData);
        setFilteredItems(menuData);

        const uniqueTypes = Array.from(new Set(menuData.map((item) => item.type)));
        setTypes(uniqueTypes);

        const ingredientsResponse = await fetch("http://localhost:3000/api/inventory");
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
      onPress={() => router.push(`/bebida/${item._id}`)}
      activeOpacity={0.75}
    >
      <Text style={styles.name} numberOfLines={1}>
        {item.display_name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.price}>
        {item.price_value} {item.price_currency}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#1e9ca4" style={{ marginTop: 50 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#cae9ef" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Nuestras bebidas</Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#557a82"
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
            selectionColor="#1e9ca4"
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterBlock}>
            <View style={styles.customPickerContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(value) => setSelectedType(value)}
                style={styles.customPicker}
                dropdownIconColor="#1e9ca4"
              >
                <Picker.Item label="Todos los tipos" value="" />
                {types.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterBlock}>
            <View style={styles.customPickerContainer}>
              <Picker
                selectedValue={selectedIngredient}
                onValueChange={(value) => setSelectedIngredient(value)}
                style={styles.customPicker}
                dropdownIconColor="#1e9ca4"
              >
                <Picker.Item label="Todos los ingredientes" value="" />
                {ingredients.map((ingredient) => (
                  <Picker.Item key={ingredient} label={ingredient} value={ingredient} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters} activeOpacity={0.85}>
            <Text style={styles.clearButtonText}>🧹 Limpiar</Text>
          </TouchableOpacity>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No se han encontrado resultados.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
    backgroundColor: "#cae9ef",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 18,
    textAlign: "left",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    height: 46,
    marginBottom: 18,
    shadowColor: "#14757a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "#1e9ca4",
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: "#14575b",
    paddingVertical: 0,
    fontWeight: "700",
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterBlock: {
    flex: 1,
    marginHorizontal: 6,
  },
  customPickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1e9ca4",
    overflow: "hidden",
    height: 46,
    justifyContent: "center",
    shadowColor: "#1e9ca4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  customPicker: {
    height: 46,
    color: "#14575b",
    fontSize: 15,
  },
  clearButton: {
    backgroundColor: "#1e9ca4",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowColor: "#14575b",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  clearButtonText: {
    color: "#cae9ef",
    fontWeight: "800",
    fontSize: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
    marginRight: marginBetweenCards,
    shadowColor: "#1e9ca4",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#14575b",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#4a7a87",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e9ca4",
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#557a82",
  },
  list: {
    paddingBottom: 36,
  },
});
