import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, Image, FlatList, 
  Pressable, StyleSheet, Animated, Easing 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const premios = [
  { id: '1', nome: 'Cupom de 10 reais' },
  { id: '2', nome: 'Camisa' },
  { id: '3', nome: 'Bola' },
];

const PONTOS_PARA_RESGATAR = 1000;

export default function Progresso() {
  const [pontosTotais, setPontosTotais] = useState(0);  // Pode vir do contexto também
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [podeResgatar, setPodeResgatar] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const json = await AsyncStorage.getItem('perfilData');
        if (json) {
          const data = JSON.parse(json);
          setFotoPerfil(data.fotoPerfil || null);
          // Se quiser, também carrega pontos, ex:
          if (data.pontosTotais !== undefined) {
            setPontosTotais(data.pontosTotais);
          }
        }
      } catch (e) {
        console.log('Erro ao carregar dados do perfil:', e);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    setPodeResgatar(pontosTotais >= PONTOS_PARA_RESGATAR);

    const progresso = Math.min(pontosTotais / PONTOS_PARA_RESGATAR, 1);
    Animated.timing(progressAnim, {
      toValue: progresso,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [pontosTotais]);

  function resgatar(premioNome: string) {
    if (podeResgatar) {
      alert(`Parabéns! Você resgatou: ${premioNome}`);
      // Atualize pontos, etc...
    } else {
      alert('Você precisa de 1000 pontos para resgatar.');
    }
  }

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>

      {/* Foto Perfil */}
      <View style={styles.fotoContainer}>
        {fotoPerfil ? (
          <Image source={{ uri: fotoPerfil }} style={styles.fotoPerfil} />
        ) : (
          <View style={[styles.fotoPerfil, styles.fotoPlaceholder]}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>?</Text>
          </View>
        )}
      </View>

      <Text style={styles.titulo}>Progresso</Text>
      <Text style={styles.pontos}>{pontosTotais} / {PONTOS_PARA_RESGATAR} pontos</Text>

      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]} />
      </View>

      <Text style={styles.subtitulo}>Prêmios disponíveis para resgate:</Text>

      <FlatList
        data={premios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.premioBtn, podeResgatar ? {} : styles.premioBtnDisabled]}
            onPress={() => resgatar(item.nome)}
            disabled={!podeResgatar}
          >
            <Text style={styles.premioTexto}>{item.nome}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>Nenhum prêmio disponível.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff',
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FD814A',
  },
  fotoPlaceholder: {
    backgroundColor: '#FD814A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FD814A', 
    textAlign: 'center',
    marginBottom: 8,
  },
  pontos: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
  },
  progressBarFill: {
    height: 25,
    backgroundColor: '#FD814A',
    borderRadius: 15,
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
    color: '#555',
  },
  premioBtn: {
    padding: 16,
    backgroundColor: '#FD814A',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  premioBtnDisabled: {
    backgroundColor: '#FFA86B',
  },
  premioTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
