import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = {
  blue: {
    background: '#ccebf3',
    backgroundAlt: '#e6f7fa',
    backgroundContrast: '#b0d7df',
    navbarBackground: '#071e41',
    primary: '#39adbe',
    text: '#071e41',
    textSecondary: '#548bbd',
    white: '#fff',
    danger: 'red',
    accent: '#39adbe',
    card: '#e6f7fa',
    border: '#b0d7df',
    placeholder: '#8eaeb7',
    buttonText: '#fff',
    inputBackground: '#d9f0f7',
    success: '#4caf50',
    error: '#f44336',
    disabled: '#a0bcc7',
    shadow: 'rgba(57, 173, 190, 0.3)',
    saveIcon: '#0074D9',
    likeIcon: '#FF4136',
    inactive: '#ffffff',
  },
  dark: {
    background: '#071e41',
    backgroundAlt: '#0a2c4d',
    backgroundContrast: '#12304a',
    navbarBackground: '#000a1a',
    primary: '#39adbe',
    text: '#ccebf3',
    textSecondary: '#91c9e8',
    white: '#fff',
    danger: 'red',
    accent: '#39adbe',
    card: '#0a2c4d',
    border: '#16496e',
    placeholder: '#548bbd',
    buttonText: '#fff',
    inputBackground: '#12304a',
    success: '#4caf50',
    error: '#f44336',
    disabled: '#3a4a63',
    shadow: 'rgba(57, 173, 190, 0.6)',
    saveIcon: '#3399FF',
    likeIcon: '#FF6B6B',
    inactive: '#ffffff',
  },
  light: {
    background: '#ffffff',
    backgroundAlt: '#f7f7f7',
    backgroundContrast: '#e0e0e0',
    navbarBackground: '#f0f0f0',
    primary: '#007aff',
    text: '#000000',
    textSecondary: '#666666',
    white: '#fff',
    danger: 'red',
    accent: '#007aff',
    card: '#f0f0f0',
    border: '#d0d0d0',
    placeholder: '#a0a0a0',
    buttonText: '#fff',
    inputBackground: '#ffffff',
    success: '#4caf50',
    error: '#f44336',
    disabled: '#cccccc',
    shadow: 'rgba(0, 0, 0, 0.1)',
    saveIcon: '#005BBB',
    likeIcon: '#FF4136',
    inactive: '#ffffff',
  },
  green: {
    background: '#d0f0c0',
    backgroundAlt: '#e8f5e9',
    backgroundContrast: '#bde5b2',
    navbarBackground: '#aedfa3',
    primary: '#4caf50',
    text: '#1b5e20',
    textSecondary: '#388e3c',
    white: '#fff',
    danger: 'red',
    accent: '#4caf50',
    card: '#e8f5e9',
    border: '#a5d6a7',
    placeholder: '#7db077',
    buttonText: '#fff',
    inputBackground: '#e0f2d9',
    success: '#388e3c',
    error: '#d32f2f',
    disabled: '#a9cba1',
    shadow: 'rgba(76, 175, 80, 0.3)',
    saveIcon: '#2e7d32',
    likeIcon: '#ff6f61',
    inactive: '#ffffff',
  },
  purple: {
    background: '#e1bee7',
    backgroundAlt: '#f3e5f5',
    backgroundContrast: '#d8b1e0',
    navbarBackground: '#cba4d2',
    primary: '#9c27b0',
    text: '#4a148c',
    textSecondary: '#7b1fa2',
    white: '#fff',
    danger: 'red',
    accent: '#9c27b0',
    card: '#f3e5f5',
    border: '#b87fcc',
    placeholder: '#9162a8',
    buttonText: '#fff',
    inputBackground: '#f0d9f0',
    success: '#7b1fa2',
    error: '#d32f2f',
    disabled: '#b89ecb',
    shadow: 'rgba(156, 39, 176, 0.3)',
    saveIcon: '#6a1b9a',
    likeIcon: '#e040fb',
    inactive: '#ffffff',
  }
};

type Theme = keyof typeof themes;

interface ThemeContextType {
  theme: Theme;
  colors: typeof themes[Theme];
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'blue',
  colors: themes.blue,
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('blue');

  useEffect(() => {
    AsyncStorage.getItem('appTheme').then(savedTheme => {
      if (savedTheme && themes[savedTheme as Theme]) {
        setThemeState(savedTheme as Theme);
      }
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('appTheme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
