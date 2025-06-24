import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Relatorios() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.subtitle}>Em breve, aqui estarão os relatórios das atividades dos usuários.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FD814A' },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: 'center' },
});
