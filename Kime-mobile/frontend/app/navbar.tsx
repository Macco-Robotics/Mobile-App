import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';

// Navbar manual con espacio de click mejorado
export default function Navbar() {
  const router = useRouter();
  const segments = useSegments();
  const active = segments[0] || 'index';

  const tabs = [
    {
      name: 'perfil',
      icon: (focused: boolean) => (
        <Ionicons name="person-circle" size={28} color={focused ? '#2f95dc' : '#999'} />
      ),
    },
    {
      name: 'crear-bebida',
      icon: (focused: boolean) => (
        <MaterialIcons name="add-circle-outline" size={28} color={focused ? '#2f95dc' : '#999'} />
      ),
    },
    {
      name: 'index',
      icon: (_: boolean) => (
        <Entypo name="home" size={32} color="#fff" />
      ),
      isMiddle: true,
    },
    {
      name: 'historial',
      icon: (focused: boolean) => (
        <FontAwesome5 name="receipt" size={24} color={focused ? '#2f95dc' : '#999'} />
      ),
    },
    {
      name: 'foro',
      icon: (focused: boolean) => (
        <Ionicons name="chatbubbles-outline" size={28} color={focused ? '#2f95dc' : '#999'} />
      ),
    },
  ];

  const defaultHitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.navbar}>
        {tabs.map((tab) => {
          const focused = active === tab.name;
          if (tab.isMiddle) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => router.push('/')}
                style={styles.middleButton}
                hitSlop={defaultHitSlop}
              >
                {tab.icon(true)}
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(`/${tab.name}`)}
              style={styles.tabButton}
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
    backgroundColor: '#001f3f',
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
  middleButton: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#2f95dc',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
