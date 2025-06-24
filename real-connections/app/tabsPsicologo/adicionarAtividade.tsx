// app/adicionarAtividade.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtividade } from '../../context/atividadeContext';
import uuid from 'react-native-uuid';

export default function AdicionarAtividade() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pontos, setPontos] = useState('');
  const router = useRouter();
  const { adicionarAtividade } = useAtividade();

  const handleSalvar = () => {
    if (!titulo || !descricao || !pontos) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const pontosNumero = Number(pontos);
if (isNaN(pontosNumero) || pontosNumero < 0 || pontosNumero > 100) {
  Alert.alert('Informe um número válido para pontos entre 0 e 100');
  return;
    }

    const hoje = new Date();
    const data = hoje.toISOString().split('T')[0];

    const novaAtividade = {
      id: uuid.v4().toString(),
      titulo,
      descricao,
      pontos: pontosNumero,
      data,
    };

    adicionarAtividade(novaAtividade);
    setTitulo('');
    setDescricao('');
    setPontos('');
    router.push('./home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Título da atividade"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição da atividade"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Pontos</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade de pontos"
        keyboardType="numeric"
        value={pontos}
        onChangeText={setPontos}
      />

      <Button title="Salvar atividade" onPress={handleSalvar} color="#FD814A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginBottom: 6, color: '#FD814A' },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
});
