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
  View,
} from "react-native";
import { useTheme } from "./context/themeContext"; // IMPORTANTE: Ajusta esta ruta si es necesario
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
  const { colors } = useTheme(); // Obtengo colores desde el contexto tema

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
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}
      onPress={() => router.push(`/bebida/${item._id}`)}
      activeOpacity={0.75}
    >
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {item.display_name}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={[styles.price, { color: colors.primary }]}>
        {item.price_value} {item.price_currency}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardAvoidingView, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Nuestras bebidas</Text>

        <View style={[styles.searchContainer, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
          <Text style={[styles.searchIcon, { color: colors.primary }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar productos..."
            placeholderTextColor={colors.placeholder}
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
            selectionColor={colors.primary}
          />
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterBlock}>
            <View
              style={[
                styles.customPickerContainer,
                { backgroundColor: colors.card, borderColor: colors.primary, shadowColor: colors.primary },
              ]}
            >
              <Picker
                selectedValue={selectedType}
                onValueChange={(value) => setSelectedType(value)}
                style={[styles.customPicker, { color: colors.text }]}
                dropdownIconColor={colors.primary}
              >
                <Picker.Item label="Todos los tipos" value="" />
                {types.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterBlock}>
            <View
              style={[
                styles.customPickerContainer,
                { backgroundColor: colors.card, borderColor: colors.primary, shadowColor: colors.primary },
              ]}
            >
              <Picker
                selectedValue={selectedIngredient}
                onValueChange={(value) => setSelectedIngredient(value)}
                style={[styles.customPicker, { color: colors.text }]}
                dropdownIconColor={colors.primary}
              >
                <Picker.Item label="Todos los ingredientes" value="" />
                {ingredients.map((ingredient) => (
                  <Picker.Item key={ingredient} label={ingredient} value={ingredient} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.primary, shadowColor: colors.text }]}
            onPress={clearFilters}
            activeOpacity={0.85}
          >
            <Text style={[styles.clearButtonText, { color: colors.background }]}>🧹 Limpiar</Text>
          </TouchableOpacity>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>No se han encontrado resultados.</Text>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "left",
  },
  searchContainer: {
    flexDirection: "row",
    borderRadius: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    height: 46,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
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
    borderRadius: 14,
    borderWidth: 2,
    overflow: "hidden",
    height: 46,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  customPicker: {
    height: 46,
    fontSize: 15,
  },
  clearButton: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  clearButtonText: {
    fontWeight: "800",
    fontSize: 16,
  },
  card: {
    width: cardWidth,
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
    marginRight: marginBetweenCards,
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
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
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
  },
  list: {
    paddingBottom: 36,
  },
});
