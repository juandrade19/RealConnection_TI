import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtividade } from '../../context/atividadeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const { atividadesCriadas, enviarParaUsuario } = useAtividade();

  const hoje = new Date().toISOString().split('T')[0];
  const atividadesHoje = atividadesCriadas.filter(a => a.data === hoje);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); 
      router.replace('../login'); 
    } catch (e) {
      console.log('Erro no logout:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo2.png')} style={styles.logo} />
          <Text style={styles.pageTitle}>Home</Text>
        </View>

        <Pressable onPress={handleLogout}>
          <MaterialIcons name="close" size={28} color="#FD814A" />
        </Pressable>
      </View>

      <View style={styles.centeredContent}>
        <Text style={styles.title}>Bem-vindo, Psicólogo!</Text>
        <Text style={styles.subtitle}>Aqui você pode gerenciar as atividades.</Text>
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {atividadesHoje.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Hoje</Text>
            {atividadesHoje.map(atividade => (
              <View key={atividade.id} style={styles.card}>
                <Text style={styles.cardTitle}>{atividade.titulo}</Text>
                <Text style={styles.cardDesc}>{atividade.descricao}</Text>
                <Text style={styles.cardPoints}>{atividade.pontos} pontos</Text>
                <Pressable
                  onPress={() => {
                    enviarParaUsuario(atividade);
                    Alert.alert('Sucesso', 'Atividade enviada para o usuário!');
                  }}
                  style={styles.enviarBtn}
                >
                  <Text style={styles.enviarBtnText}>Enviar para usuário</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FD814A',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FD814A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f7f7fb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FD814A',
  },
  cardDesc: {
    fontSize: 14,
    marginTop: 4,
  },
  cardPoints: {
    marginTop: 6,
    color: '#FD814A',
    fontWeight: '600',
  },
  enviarBtn: {
    marginTop: 12,
    backgroundColor: '#FD814A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  enviarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
