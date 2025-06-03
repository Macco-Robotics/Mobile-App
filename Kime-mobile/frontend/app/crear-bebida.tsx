import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormData>({
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
      const validIngredients = formData.ingredients
        .filter(item => item.ingredient && item.quantity !== '');

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
            style={[styles.input, { height: 80 }]}
            onChangeText={onChange}
            value={value}
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
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              <Picker.Item label="Selecciona un tipo" value="" />
              {["Cóctel", "Smoothie", "Infusión", "Zumo", "Bebida energética", "Refresco"].map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
            {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
          </>
        )}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.ingredientContainer}>
          <Controller
            control={control}
            name={`ingredients.${index}.ingredient` as const}
            rules={{ required: 'Selecciona un ingrediente' }}
            render={({ field: { onChange, value } }) => (
              <>
                <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                  <Picker.Item label="Selecciona ingrediente" value="" />
                  {ingredientOptions.map(opt => (
                    <Picker.Item key={opt._id} label={opt.name} value={opt._id} />
                  ))}
                </Picker>
                {errors.ingredients?.[index]?.ingredient && (
                  <Text style={styles.errorText}>{errors.ingredients[index].ingredient?.message}</Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name={`ingredients.${index}.quantity` as const}
            rules={{ required: 'Indica una cantidad' }}
            render={({ field: { onChange, value } }) => (
              <>
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
              </>
            )}
          />
          <TouchableOpacity onPress={() => remove(index)}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={() => append({ ingredient: '', quantity: '' })} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Añadir ingrediente</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="isPublic"
        render={({ field: { onChange, value } }) => (
          <View style={styles.publicToggle}>
            <Text style={styles.publicText}>¿Hacer pública?</Text>
            <TouchableOpacity onPress={() => onChange(!value)} style={{ marginLeft: 8 }}>
              <Text style={styles.publicText}>{value ? 'Sí' : 'No'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Crear Bebida</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#001F3F',
    flexGrow: 1,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  ingredientContainer: {
    backgroundColor: '#003366',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  deleteText: {
    color: '#FF4136',
    marginTop: 6,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0074D9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2ECC40',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  publicToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  publicText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF4136',
    fontSize: 14,
    marginBottom: 8,
  },
});
