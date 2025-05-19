import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="index"    // Home será la primera ruta
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-circle" size={28} color={focused ? '#2f95dc' : '#999'} />
          ),
        }}
      />
      <Tabs.Screen
        name="crear-bebida"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="add-circle-outline" size={28} color={focused ? '#2f95dc' : '#999'} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: (props) => {
            const { onPress, accessibilityState, accessibilityLabel, testID } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                testID={testID}
                style={styles.homeButton}
              >
                <Entypo name="home" size={32} color="#fff" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="receipt" size={24} color={focused ? '#2f95dc' : '#999'} />
          ),
        }}
      />
      <Tabs.Screen
        name="foro"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="chatbubbles-outline" size={28} color={focused ? '#2f95dc' : '#999'} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#001f3f',
    elevation: 5,
  },
  homeButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f95dc',
    width: 70,
    height: 70,
    borderRadius: 35,
    elevation: 5,
  },
});