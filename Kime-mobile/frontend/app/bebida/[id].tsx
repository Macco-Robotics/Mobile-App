import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Bebida = {
  _id: string;
  display_name: string;
  is_available: boolean;
  description: string;
  type: string;
  price_value: number;
  price_currency: string;
  quantity_available: number;
  recipe: any;
};

export default function BebidaDetalle() {
  const { id, slug } = useLocalSearchParams();
  const router = useRouter();
  const [bebida, setBebida] = useState<Bebida | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBebida = async () => {
      try {
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_DEPLOYMENT}/api/menu/product/${id}`, {
          headers: {
            'x-restaurant-slug': slug as string,
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setBebida(data);
      } catch (error) {
        console.error("Error al cargar bebida:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBebida();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#101868" />
        <Text style={styles.loadingText}>Cargando bebida...</Text>
      </View>
    );
  }

  if (!bebida) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se encontró la bebida.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
          accessibilityLabel="Volver al menú"
        >
          <Feather name="arrow-left" size={24} color="#ccebf3" />
        </TouchableOpacity>

        <Text style={styles.title}>{bebida.display_name}</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Disponible</Text>
          <Text
            style={[
              styles.value,
              bebida.is_available ? styles.available : styles.notAvailable,
            ]}
          >
            {bebida.is_available ? "Sí" : "No"}
          </Text>
        </View>

        <Separator />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.value}>{bebida.description}</Text>
        </View>

        <Separator />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Tipo</Text>
          <Text style={styles.value}>{bebida.type}</Text>
        </View>

        <Separator />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Precio</Text>
          <Text style={styles.value}>
            {bebida.price_value.toFixed(2)} {bebida.price_currency}
          </Text>
        </View>

        <Separator />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Cantidad disponible</Text>
          <Text style={styles.value}>{bebida.quantity_available}</Text>
        </View>

        <Separator />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Receta</Text>
          <View style={styles.recipeContainer}>
            {Array.isArray(bebida.recipe) ? (
              bebida.recipe.map((ingrediente, index) => (
                <Text key={index} style={styles.recipeText}>
                  • {ingrediente.name}: {ingrediente.quantity} {ingrediente.unit}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>{bebida.recipe}</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#ccebf3", // fondo general suave
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#101868",
    shadowColor: "#101868",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 8,
    borderRadius: 30,
    backgroundColor: "rgba(16, 24, 104, 0.8)", // #101868 con opacidad
    zIndex: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
    color: "#101868",
  },
  infoBlock: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101868",
    marginBottom: 6,
  },
  value: {
    fontSize: 17,
    color: "#333",
    lineHeight: 22,
  },
  available: {
    color: "#27AE60",
    fontWeight: "700",
  },
  notAvailable: {
    color: "#E74C3C",
    fontWeight: "700",
  },
  recipeContainer: {
    marginTop: 8,
    backgroundColor: "#e0f3fb", // variante clara de #ccebf3
    borderRadius: 12,
    padding: 16,
  },
  recipeText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#ccebf3",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#101868",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#101868",
    marginVertical: 14,
    borderRadius: 1,
    opacity: 0.2,
  },
});
