import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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
import { MaterialIcons } from '@expo/vector-icons';
import Header from './header';
import { Picker } from '@react-native-picker/picker';

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
  const navigation = useNavigation();
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
    try {
      const validIngredients = formData.ingredients.filter(item => item.ingredient && item.quantity !== '');
      if (validIngredients.length < 2) {
        Alert.alert('Error', 'Debes añadir al menos 2 ingredientes completos.');
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

      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:3000/api/drink', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);

      Alert.alert('Éxito', 'Bebida creada con éxito');
      navigation.navigate('index');
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la bebida');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#2ECC40" />
            <Text style={styles.loadingText}>Guardando bebida...</Text>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nombre:</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput style={styles.input} onChangeText={onChange} value={value} />
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
                  <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
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
              <Controller
                control={control}
                name={`ingredients.${index}.ingredient` as const}
                rules={{ required: 'Selecciona un ingrediente' }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.ingredientInputWrapper}>
                    <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                      <Picker.Item label="Selecciona ingrediente" value="" />
                      {ingredientOptions.map(opt => (
                        <Picker.Item key={opt._id} label={opt.name} value={opt._id} />
                      ))}
                    </Picker>
                    {errors.ingredients?.[index]?.ingredient && (
                      <Text style={styles.errorText}>{errors.ingredients[index].ingredient?.message}</Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name={`ingredients.${index}.quantity` as const}
                rules={{ required: 'Indica una cantidad' }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.ingredientInputWrapper}>
                    <TextInput
                      placeholder="Cantidad"
                      keyboardType="numeric"
                      style={styles.input}
                      onChangeText={text => onChange(Number(text))}
                      value={value ? String(value) : ''}
                    />
                    {errors.ingredients?.[index]?.quantity && (
                      <Text style={styles.errorText}>{errors.ingredients[index].quantity?.message}</Text>
                    )}
                  </View>
                )}
              />
              <TouchableOpacity onPress={() => remove(index)} style={styles.trashButton}>
                <MaterialIcons name="delete" size={28} color="#FF4136" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={() => append({ ingredient: '', quantity: '' })} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Añadir ingrediente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.publicityRow}>
            <Text style={styles.sectionTitle}>¿Quieres que tu bebida sea pública?</Text>
            <Controller
              control={control}
              name="isPublic"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  thumbColor={value ? '#39adbe' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#ccebf3' }}
                />
              )}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Crear Bebida</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  container: {
    flex: 1,
    backgroundColor: "#cae9ef",
  },
  scroll: {
    padding: 16,
    paddingBottom: 60,
  },
  sectionTitle: {
    color: '#ccebf3',
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0b2c5e',
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  label: {
    color: '#ccebf3',
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
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  trashButton: {
    padding: 6,
  },
  addButton: {
    backgroundColor: '#ccebf3',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  addButtonText: {
    color: '#071e41',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2ECC40',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 40,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4136',
    fontSize: 13,
    marginTop: 4,
  },
  publicityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
