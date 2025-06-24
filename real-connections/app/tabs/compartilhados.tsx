import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Image, 
  TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Compartilhar() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [allowComments, setAllowComments] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar imagens.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !caption || !image) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione uma imagem!');
      return;
    }

    try {
      router.push({
        pathname: '/tabs/comunidade',
        params: {
          title,
          caption,
          image,
          allowComments: allowComments ? 'true' : 'false',
        },
      });

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a publicação.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Criar Publicação</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={60} color="#ccc" />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Legenda"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAllowComments(!allowComments)}
      >
        <Ionicons
          name={allowComments ? 'checkbox' : 'square-outline'}
          size={24}
          color="#FD814A"
        />
        <Text style={styles.checkboxLabel}>Permitir comentários</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F7F7',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    color: '#FD814A',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  imagePicker: {
    backgroundColor: '#eee',
    width: '100%',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: '#555',
  },
  button: {
    backgroundColor: '#FD814A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
