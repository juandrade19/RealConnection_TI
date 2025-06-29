import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';

const { height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [crm, setCrm] = useState('');
  const [isPsychologist, setIsPsychologist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if ((isPsychologist && !crm) || (!isPsychologist && !email) || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const loginBody = isPsychologist
      ? { crm, senha, tipo: 'psicologo' }
      : { email, senha, tipo: 'familia' };
    const endpoint = '/usuarios/login';

    setLoading(true);

    try {
      const response = await fetch(`https://realconnectionti-production.up.railway.app${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }

        setUser({
          id: data.id,
          nome: data.nome,
          tipo: data.tipo,
          email: data.email,
          crm: data.crm,
        });

        Alert.alert('Sucesso', 'Login bem-sucedido!');
        if (isPsychologist) {
          router.replace('../tabsPsicologo/home');
        } else {
          router.replace('../tabs/comunidade');
        }
      } else {
        Alert.alert('Erro', data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro na requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <View style={styles.card}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Login</Text>
        </View>

        <Text style={styles.subtitle}>Entre com sua conta!</Text>

        {isPsychologist ? (
          <TextInput
            style={styles.input}
            placeholder="CRP"
            value={crm}
            onChangeText={setCrm}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isPsychologist ? 'Entrar como psicólogo' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/inscricao')}>
          <Text style={styles.link}>Não tem conta? Inscreva-se</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsPsychologist(!isPsychologist)}>
          <Text style={styles.link}>
            {isPsychologist ? 'Entrar como familiar' : 'Entrar como psicólogo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', alignItems: 'center' },
  logo: { width: 300, height: 300, marginTop: 60 },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
    padding: 24,
    height: height / 1.5,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 10,
  },
  tagContainer: {
    alignSelf: 'center',
    backgroundColor: '#FD814A',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
    marginTop: -30,
  },
  tagText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subtitle: {
    color: '#FD814A',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  forgot: {
    fontSize: 13,
    color: '#FD814A',
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#FD814A',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: {
    marginTop: 10,
    color: '#FD814A',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
});
