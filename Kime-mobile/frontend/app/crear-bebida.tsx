import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from './header';
import { useTheme } from './context/themeContext'; // Ajusta ruta según tu estructura

type IngredientItem = {
  ingredient: string;
  quantity: number | string;
};

type FormData = {
  name: string;
  description: string;
  type: string;
  isPublic: boolean;
  ingredients: IngredientItem[];
  image: string;
};

export default function DrinkCreationForm() {
  const { colors } = useTheme();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
      isPublic: false,
      ingredients: [{ ingredient: '', quantity: '' }, { ingredient: '', quantity: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });
  const [ingredientOptions, setIngredientOptions] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/ingredient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIngredientOptions(response.data);
      } catch (error) {
        console.error('Error al obtener ingredientes:', error);
      }
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    setValue('image', 'http://localhost:3000/images/bebidaPlaceholder.png');
  }, [setValue]);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const validIngredients = formData.ingredients.filter(item => item.ingredient && item.quantity !== '');
      if (validIngredients.length < 2) {
        Alert.alert('Error', 'Debes añadir al menos 2 ingredientes completos.');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        isPublic: formData.isPublic,
        image: formData.image,
        ingredients: validIngredients.map(item => ({
          ingredient: item.ingredient,
          quantity: Number(item.quantity)
        }))
      };

      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:3000/api/drink', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Éxito', 'Bebida creada con éxito');
      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la bebida');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      padding: 16,
      paddingBottom: 60,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '700',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    ingredientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    ingredientInputWrapper: {
      flex: 1,
      marginRight: 8,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.inputBackground,
      justifyContent: 'center',
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
    },
    input: {
      height: 48,
      fontSize: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    pickerContainer: {
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.inputBackground,
    },
    picker: {
      height: 48,
      width: '100%',
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    trashButton: {
      padding: 6,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 16,
      marginTop: 10,
    },
    addButtonText: {
      color: colors.buttonText,
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: colors.success,
      paddingVertical: 18,
      borderRadius: 16,
      marginTop: 16,
      marginBottom: 40,
      elevation: 3,
    },
    submitButtonText: {
      color: colors.buttonText,
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
      marginTop: 4,
    },
    publicityRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 16,
      elevation: 5,
    },
    modalText: {
      color: colors.text,
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <Header title="Crear Bebida" />

      {loading && (
        <Modal transparent animationType="fade" visible={loading}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Guardando bebida...</Text>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información General</Text>

          <Text style={styles.label}>Nombre:</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Este campo es obligatorio' }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Ej. Mojito"
                  placeholderTextColor={colors.placeholder}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </>
            )}
          />

          <Text style={styles.label}>Descripción:</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                style={[styles.input, { height: 100 }]}
                onChangeText={onChange}
                value={value}
                placeholder="Describe la bebida"
                placeholderTextColor={colors.placeholder}
              />
            )}
          />

          <Text style={styles.label}>Tipo:</Text>
          <Controller
            control={control}
            name="type"
            rules={{ required: 'Selecciona un tipo de bebida' }}
            render={({ field: { onChange, value } }) => (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                    dropdownIconColor={colors.text}
                    itemStyle={{ color: colors.text }}
                  >
                    <Picker.Item label="Selecciona un tipo" value="" />
                    {["Cóctel", "Smoothie", "Infusión", "Zumo", "Bebida energética", "Refresco"].map(type => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
              </>
            )}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {fields.map((field, index) => (
            <View key={field.id} style={styles.ingredientRow}>
              <View style={[styles.ingredientInputWrapper, { flex: 3 }]}>
                <Controller
                  control={control}
                  name={`ingredients.${index}.ingredient` as const}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                        dropdownIconColor={colors.text}
                        itemStyle={{ color: colors.text }}
                      >
                        <Picker.Item label="Selecciona un ingrediente" value="" />
                        {ingredientOptions.map((opt) => (
                          <Picker.Item key={opt._id} label={opt.name} value={opt._id} />
                        ))}
                      </Picker>
                    </View>
                  )}
                />
              </View>

              <View style={[styles.ingredientInputWrapper, { flex: 2 }]}>
                <Controller
                  control={control}
                  name={`ingredients.${index}.quantity` as const}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      onChangeText={onChange}
                      value={value.toString()}
                      placeholder="Cantidad"
                      placeholderTextColor={colors.placeholder}
                    />
                  )}
                />
              </View>

              <TouchableOpacity
                style={styles.trashButton}
                onPress={() => remove(index)}
                disabled={fields.length <= 2}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={30}
                  color={fields.length > 2 ? colors.error : colors.disabled}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => append({ ingredient: '', quantity: '' })}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Añadir ingrediente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.publicityRow}>
            <Text style={[styles.label, { marginBottom: 0 }]}>¿Pública?</Text>
            <Controller
              control={control}
              name="isPublic"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={value ? colors.buttonText : '#f4f3f4'}
                />
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>Guardar Bebida</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
