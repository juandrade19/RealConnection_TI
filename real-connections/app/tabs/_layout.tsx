// app/tabs/_layout.tsx - REMOVA o AtividadeProvider daqui
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabel: () => null,
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;
          switch (route.name) {
            case 'comunidade':
              iconName = 'people-outline';
              break;
            case 'atividades':
              iconName = 'create-outline';
              break;
            case 'progresso':
              iconName = 'bar-chart-outline';
              break;
            case 'perfil':
              iconName = 'person-outline';
              break;
            case 'compartilhados':
              return (
                <TouchableOpacity style={styles.plusButton}>
                  <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
              );
          }
          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? '#FD814A' : '#BEBEBE'}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="comunidade" />
      <Tabs.Screen name="atividades" />
      <Tabs.Screen name="compartilhados" />
      <Tabs.Screen name="progresso" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    elevation: 10,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FD814A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
