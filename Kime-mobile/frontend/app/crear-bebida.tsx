import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Alert, Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
      isPublic: false,
      ingredients: [{ ingredient: '', quantity: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });
  const [ingredientOptions, setIngredientOptions] = useState<{ _id: string; name: string }[]>([]);

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
      const ingredientsWithNumbers = formData.ingredients
        .filter(item => item.ingredient && item.quantity !== '')
        .map(item => ({
          ingredient: item.ingredient,
          quantity: Number(item.quantity)
        }));

      if (!formData.name || !formData.type || ingredientsWithNumbers.length === 0) {
        Alert.alert('Error', 'Completa todos los campos obligatorios.');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        isPublic: formData.isPublic,
        image: formData.image,
        ingredients: ingredientsWithNumbers
      };

      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:3000/api/drink', payload, config);
      Alert.alert('Éxito', 'Bebida creada con éxito');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la bebida');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Nombre:</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text>Descripción:</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            multiline
            style={{ borderWidth: 1, padding: 8, height: 80, marginBottom: 12 }}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text>Tipo:</Text>
      <Controller
        control={control}
        name="type"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange} style={{ marginBottom: 12 }}>
            <Picker.Item label="Selecciona un tipo" value="" />
            {["Cóctel", "Smoothie", "Infusión", "Zumo", "Bebida energética", "Refresco"].map(type => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        )}
      />

      <Text>Ingredientes:</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={{ marginBottom: 12 }}>
          <Controller
            control={control}
            name={`ingredients.${index}.ingredient` as const}
            render={({ field: { onChange, value } }) => (
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Selecciona ingrediente" value="" />
                {ingredientOptions.map(opt => (
                  <Picker.Item key={opt._id} label={opt.name} value={opt._id} />
                ))}
              </Picker>
            )}
          />
          <Controller
            control={control}
            name={`ingredients.${index}.quantity` as const}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Cantidad"
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 6, marginTop: 4 }}
                onChangeText={text => onChange(Number(text))}
                value={value ? String(value) : ''}
              />
            )}
          />
          <TouchableOpacity onPress={() => remove(index)} style={{ marginTop: 4 }}>
            <Text style={{ color: 'red' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Button title="+ Añadir ingrediente" onPress={() => append({ ingredient: '', quantity: '' })} />

      <Controller
        control={control}
        name="isPublic"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <Text>¿Hacer pública?</Text>
            <TouchableOpacity onPress={() => onChange(!value)} style={{ marginLeft: 8 }}>
              <Text>{value ? 'Sí' : 'No'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Crear Bebida" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}
