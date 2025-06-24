import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [nomeFamilia, setNomeFamilia] = useState('Família Ferreira');
  const [nomeFamiliaTemp, setNomeFamiliaTemp] = useState('');
  const [modalNomeVisivel, setModalNomeVisivel] = useState(false);

  const [descricao, setDescricao] = useState('');
  const [descricaoTemp, setDescricaoTemp] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [fotoCapa, setFotoCapa] = useState<string | null>(null);
  const [galeria, setGaleria] = useState<string[]>([]);
  const [novoMembro, setNovoMembro] = useState('');
  const [membros, setMembros] = useState<string[]>([]);

  const salvarDados = async () => {
    try {
      await AsyncStorage.setItem(
        'perfilData',
        JSON.stringify({ nomeFamilia, descricao, fotoPerfil, fotoCapa, galeria, membros })
      );
    } catch (e) {
      console.log('Erro ao salvar dados:', e);
    }
  };

  const carregarDados = async () => {
    try {
      const json = await AsyncStorage.getItem('perfilData');
      if (json) {
        const data = JSON.parse(json);
        setNomeFamilia(data.nomeFamilia || 'Família Ferreira');
        setNomeFamiliaTemp(data.nomeFamilia || 'Família Ferreira');
        setDescricao(data.descricao || '');
        setDescricaoTemp(data.descricao || '');
        setFotoPerfil(data.fotoPerfil || null);
        setFotoCapa(data.fotoCapa || null);
        setGaleria(data.galeria || []);
        setMembros(data.membros || []);
      } else {
        setMembros([
          params.nome || 'Usuário Principal',
          `Dependente (${params.dependente || 'Nome do Dependente'})`,
        ]);
      }
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    salvarDados();
  }, [nomeFamilia, descricao, fotoPerfil, fotoCapa, galeria, membros]);

  const handleEscolherImagem = async (tipo: 'perfil' | 'galeria' | 'capa') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (tipo === 'perfil') {
        setFotoPerfil(uri);
      } else if (tipo === 'capa') {
        setFotoCapa(uri);
      } else {
        setGaleria([...galeria, uri]);
      }
    }
  };

  const handleAdicionarMembro = () => {
    if (novoMembro.trim() !== '') {
      setMembros([...membros, novoMembro.trim()]);
      setNovoMembro('');
    }
  };

  const salvarDescricao = () => {
    setDescricao(descricaoTemp);
    setModalVisivel(false);
  };

  const salvarNomeFamilia = () => {
    setNomeFamilia(nomeFamiliaTemp.trim() || 'Família Ferreira');
    setModalNomeVisivel(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      router.replace('/login');
    } catch (e) {
      console.log('Erro ao fazer logout:', e);
    }
  };

  return (
    <View style={styles.container}>
      {fotoCapa && (
        <Image source={{ uri: fotoCapa }} style={styles.backgroundImage} />
      )}

      <TouchableOpacity
        style={styles.botaoCapa}
        onPress={() => handleEscolherImagem('capa')}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.botaoSair}
          accessible={true}
          accessibilityLabel="Sair"
        >
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <TouchableOpacity onPress={() => handleEscolherImagem('perfil')}>
            <Image
              source={fotoPerfil ? { uri: fotoPerfil } : require('../../assets/default.png')}
              style={styles.fotoPerfil}
            />
          </TouchableOpacity>

          <View style={styles.nomeContainer}>
            <Text style={styles.nomeFamilia}>{nomeFamilia}</Text>
            <TouchableOpacity onPress={() => setModalNomeVisivel(true)}>
              <Ionicons name="create-outline" size={18} color="#FD814A" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.secao}>
            <Text style={styles.titulo}>Integrantes:</Text>
            {membros.map((m, i) => (
              <Text key={i} style={styles.textoNormal}>- {m}</Text>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TextInput
                placeholder="Nome do membro"
                placeholderTextColor="#aaa"
                value={novoMembro}
                onChangeText={setNovoMembro}
                style={{
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: '#FD814A',
                  marginRight: 8,
                  color: '#333',
                }}
              />
              <TouchableOpacity onPress={handleAdicionarMembro}>
                <Ionicons name="add-circle" size={28} color="#FD814A" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.secao}>
            <View style={styles.linha}>
              <Text style={styles.titulo}>Como sua família funciona:</Text>
              <TouchableOpacity onPress={() => setModalVisivel(true)}>
                <Ionicons name="create-outline" size={20} color="#FD814A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.textoNormal}>{descricao}</Text>
          </View>

          <View style={styles.secao}>
            <View style={styles.linha}>
              <Text style={styles.titulo}>Galeria da Família</Text>
              <TouchableOpacity onPress={() => handleEscolherImagem('galeria')}>
                <Ionicons name="add-circle-outline" size={24} color="#FD814A" />
              </TouchableOpacity>
            </View>
            {galeria.length === 0 ? (
              <Text style={styles.semImagem}>Nenhuma imagem adicionada.</Text>
            ) : (
              <FlatList
                data={galeria}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.imagemGaleria} />
                )}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>

     
      <Modal visible={modalNomeVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar nome da família</Text>
            <TextInput
              style={styles.inputModal}
              value={nomeFamiliaTemp}
              onChangeText={setNomeFamiliaTemp}
              placeholder="Digite o nome"
              placeholderTextColor="#fff"
            />
            <View style={styles.botoesModal}>
              <TouchableOpacity onPress={() => setModalNomeVisivel(false)} style={styles.botaoCancelar}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarNomeFamilia} style={styles.botaoSalvar}>
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar descrição</Text>
            <TextInput
              style={[styles.inputModal, { height: 80 }]}
              multiline
              value={descricaoTemp}
              onChangeText={setDescricaoTemp}
              placeholder="Digite a descrição"
              placeholderTextColor="#fff"
            />
            <View style={styles.botoesModal}>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.botaoCancelar}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarDescricao} style={styles.botaoSalvar}>
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: {
    width: width,
    height: height * 0.35,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  botaoCapa: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#00000088',
    padding: 6,
    borderRadius: 50,
    zIndex: 10,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
  },
  botaoSair: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  textoBotaoSair: {
    color: '#FD814A',
    fontWeight: '600',
    fontSize: 14,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    borderWidth: 3,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  nomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nomeFamilia: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  secao: { marginTop: 20 },
  titulo: { color: '#FD814A', fontWeight: '700', fontSize: 16, marginBottom: 8 },
  textoNormal: { color: '#333', marginBottom: 4 },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagemGaleria: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  semImagem: { color: '#999' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  modalContent: {
    backgroundColor: '#FD814A',
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputModal: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoCancelar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  botaoSalvar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  textoBotao: {
    color: '#FD814A',
    fontWeight: 'bold',
  },
});
