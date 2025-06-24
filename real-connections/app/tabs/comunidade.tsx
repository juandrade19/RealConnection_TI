import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList,
  TouchableOpacity, StyleSheet, Animated
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Comunidade() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [posts, setPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [animations, setAnimations] = useState<{ [key: string]: Animated.Value }>({});
  const [postAdded, setPostAdded] = useState(false);
  const [nomeFamilia, setNomeFamilia] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const json = await AsyncStorage.getItem('perfilData');
        if (json) {
          const data = JSON.parse(json);
          setNomeFamilia(data.nomeFamilia || '');
          setFotoPerfil(data.fotoPerfil || null);
        }
      } catch (e) {
        console.log('Erro ao carregar dados do perfil:', e);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (params.title && params.caption && params.image && !postAdded) {
      const newPost = {
        id: Date.now().toString(),
        nome: 'Sua Família',
        title: params.title as string,
        texto: params.caption as string,
        imagens: [params.image as string],
        allowComments: params.allowComments === 'true',
      };

      setPosts((prev) => [newPost, ...prev]);
      setAnimations((prev) => ({
        ...prev,
        [newPost.id]: new Animated.Value(1),
      }));
      setPostAdded(true);
    }
  }, [params, postAdded]);

  const toggleLike = (id: string) => {
    const isLiked = likes[id];

    Animated.sequence([
      Animated.timing(animations[id], {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animations[id], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setLikes({ ...likes, [id]: !isLiked });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      {item.imagens.length > 0 && (
        <Image source={{ uri: item.imagens[0] }} style={styles.postImage} />
      )}

      <Text style={styles.texto}>{item.texto}</Text>

      <View style={styles.actions}>
        {item.allowComments && (
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={20} color="#555" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Animated.View style={{ transform: [{ scale: animations[item.id] }] }}>
            <Ionicons
              name={likes[item.id] ? 'heart' : 'heart-outline'}
              size={20}
              color={likes[item.id] ? '#FD814A' : '#555'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo2.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Comunidade</Text>
        <Text style={styles.profileName}>{nomeFamilia}</Text>
        <View style={styles.profileContainer}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
          ) : (
            <Image source={require('../../assets/default.png')} style={styles.profileImage} />
          )}
          
        </View>
      </View>

      {posts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma publicação ainda. Que tal criar uma?</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  logo: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FD814A' },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
  },
  profileName: {
    fontSize: 14,
    color: '#333'
  },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#FD814A', marginBottom: 6 },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  texto: { fontSize: 14, color: '#555', marginBottom: 8 },
  actions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});