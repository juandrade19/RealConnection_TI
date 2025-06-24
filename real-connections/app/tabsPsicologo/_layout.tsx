import { Tabs } from 'expo-router';
import { StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'home-outline';

          switch (route.name) {
            case 'home':
              iconName = 'home-outline';
              break;
            case 'adicionarAtividade':
              iconName = 'list-circle-outline'; 
              break;
            case 'relatorios':
              iconName = 'clipboard-outline';
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? '#FD814A' : '#BEBEBE'}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let label = '';

          switch (route.name) {
            case 'home':
              label = 'Home';
              break;
            case 'adicionarAtividade':
              label = 'Atividades';
              break;
            case 'relatorios':
              label = 'Relatórios';
              break;
          }

          return (
            <Text
              style={{
                fontSize: 12,
                color: focused ? '#FD814A' : '#BEBEBE',
              }}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="adicionarAtividade" />
      <Tabs.Screen name="relatorios" />
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
});
