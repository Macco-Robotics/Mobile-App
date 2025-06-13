import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { authEvents } from '../utils/authEvents';
import Navbar from './navbar';
import { ThemeProvider } from './context/themeContext'; // <-- Importa el ThemeProvider

export default function RootLayout() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLogged(!!token);
  };

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [])
  );

  useEffect(() => {
    authEvents.on('authChange', checkToken);
    return () => {
      authEvents.off('authChange', checkToken);
    };
  }, []);

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        {isLogged && <Navbar />}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Puedes quitar este color fijo si usas el contexto
  },
});
