import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";

type Bebida = {
  _id: string;
  display_name: string;
  is_available: boolean;
  description: string;
  type: string;
  price_value: number;
  price_currency: string;
  quantity_available: number;
  recipe: string;
};

export default function BebidaDetalle() {
  const { id } = useLocalSearchParams();
  const [bebida, setBebida] = useState<Bebida | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBebida = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/menu/product/${id}`);
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
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;
  }

  if (!bebida) {
    return <Text style={{ marginTop: 40, textAlign: "center" }}>No se encontró la bebida.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bebida.display_name}</Text>
      <Text style={styles.label}>Disponible:</Text>
      <Text style={styles.value}>{bebida.is_available ? "Sí" : "No"}</Text>

      <Text style={styles.label}>Descripción:</Text>
      <Text style={styles.value}>{bebida.description}</Text>

      <Text style={styles.label}>Tipo:</Text>
      <Text style={styles.value}>{bebida.type}</Text>

      <Text style={styles.label}>Precio:</Text>
      <Text style={styles.value}>
        {bebida.price_value} {bebida.price_currency}
      </Text>

      <Text style={styles.label}>Cantidad disponible:</Text>
      <Text style={styles.value}>{bebida.quantity_available}</Text>

      <Text style={styles.label}>Receta:</Text>
      {Array.isArray(bebida.recipe) ? (
        bebida.recipe.map((ingrediente, index) => (
          <Text key={index} style={styles.value}>
            - {ingrediente.name}: {ingrediente.quantity} {ingrediente.unit}
          </Text>
        ))
      ) : (
        <Text style={styles.value}>{bebida.recipe}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: "#333",
  },
});
