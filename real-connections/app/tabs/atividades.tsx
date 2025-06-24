// app/tabs/atividades.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAtividade } from '../../context/atividadeContext';

export default function Atividades() {
  const { atividadesUsuario, marcarComoRespondida } = useAtividade();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Minhas Atividades</Text>
      {atividadesUsuario.length === 0 ? (
        <Text style={styles.empty}>Nenhuma atividade recebida ainda.</Text>
      ) : (
        atividadesUsuario.map((atividade) => (
          <View key={atividade.id} style={styles.card}>
            <Text style={styles.cardTitle}>{atividade.titulo}</Text>
            <Text style={styles.cardDesc}>{atividade.descricao}</Text>
            <Text style={styles.cardPoints}>{atividade.pontos} pontos</Text>
            {!atividade.respondido && (
              <Pressable
                onPress={() => marcarComoRespondida(atividade.id)}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Marcar como concluída</Text>
              </Pressable>
            )}
            {atividade.respondido && <Text style={styles.done}>✅ Concluído</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FD814A', marginBottom: 10 },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 50 },
  card: {
    backgroundColor: '#f7f7fb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FD814A' },
  cardDesc: { fontSize: 14, marginTop: 4 },
  cardPoints: { marginTop: 6, color: '#FD814A', fontWeight: '600' },
  btn: {
    marginTop: 12,
    backgroundColor: '#FD814A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  done: { marginTop: 10, color: 'green', fontWeight: 'bold' },
});
