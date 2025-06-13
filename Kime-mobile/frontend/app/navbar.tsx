import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from './context/themeContext'; // Ajusta la ruta según tu estructura

export default function Navbar() {
  const router = useRouter();
  const segments = useSegments();
  const active = segments[0] || 'index';

  const { colors } = useTheme();

  const tabs = [
    {
      name: 'perfil',
      icon: (focused: boolean) => (
        <Ionicons name="person-circle" size={28} color={focused ? colors.primary : colors.inactive} />
      ),
    },
    {
      name: 'crear-bebida',
      icon: (focused: boolean) => (
        <MaterialIcons name="add-circle-outline" size={28} color={focused ? colors.primary : colors.inactive} />
      ),
    },
    {
      name: 'index',
      icon: (_: boolean) => (
        <Entypo name="home" size={32} color={colors.backgroundContrast} />
      ),
      isMiddle: true,
    },
    {
      name: 'historial',
      icon: (focused: boolean) => (
        <FontAwesome5 name="receipt" size={24} color={focused ? colors.primary : colors.inactive} />
      ),
    },
    {
      name: 'foro',
      icon: (focused: boolean) => (
        <Ionicons name="chatbubbles-outline" size={28} color={focused ? colors.primary : colors.inactive} />
      ),
    },
  ];

  const defaultHitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={[styles.navbar, { backgroundColor: colors.navbarBackground }]}>
        {tabs.map((tab) => {
          const focused = active === tab.name;
          const onPress = () => {
            router.push(tab.isMiddle ? '/' : `/${tab.name}`);
          };

          if (tab.isMiddle) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={onPress}
                style={[styles.middleButton, { backgroundColor: colors.primary }]}
                hitSlop={defaultHitSlop}
              >
                {tab.icon(true)}
              </TouchableOpacity>
            );
          }

          const extraStyle = (tab.name === 'crear-bebida' || tab.name === 'historial')
            ? styles.sideSpacing
            : {};

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              style={[styles.tabButton, extraStyle]}
              hitSlop={defaultHitSlop}
            >
              {tab.icon(focused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navbar: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSpacing: {
    marginHorizontal: 30,
  },
  middleButton: {
    position: 'absolute',
    top: -30,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
