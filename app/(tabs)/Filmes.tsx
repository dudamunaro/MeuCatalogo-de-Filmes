import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


const LOGO = require('../../assets/images/Logo.webp'); 

export default function Filmes() {
  const navigation = useNavigation<any>();
  const [filmes, setFilmes] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [estrelas, setEstrelas] = useState<{ [key: string]: number }>({});
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarFilmes();
    carregarFavoritos();
    carregarEstrelas();
  }, []);

  // Atualiza favoritos sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const buscarFilmes = async () => {
    try {
      setErro('');
      const response = await axios.get('https://api.tvmaze.com/shows');
      setFilmes(response.data.slice(0, 50)); // Pega só os 50 primeiros
    } catch (error) {
      setErro('Erro ao buscar filmes. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  const carregarFavoritos = async () => {
    const data = await AsyncStorage.getItem('favoritos');
    if (data) {
      setFavoritos(JSON.parse(data).map((id: any) => id.toString()));
    } else {
      setFavoritos([]);
    }
  };

  const carregarEstrelas = async () => {
    const data = await AsyncStorage.getItem('estrelas');
    if (data) {
      setEstrelas(JSON.parse(data));
    }
  };

  const salvarEstrelas = async (novoEstado: { [key: string]: number }) => {
    setEstrelas(novoEstado);
    await AsyncStorage.setItem('estrelas', JSON.stringify(novoEstado));
  };

  // Função para favoritar/desfavoritar e persistir detalhes
  const alternarFavorito = async (id: string, filmeObj?: any) => {
    // Carrega favoritos atuais
    const favoritosSalvos = await AsyncStorage.getItem('favoritos');
    let favoritosArray = favoritosSalvos ? JSON.parse(favoritosSalvos) : [];

    // Carrega detalhes atuais
    const detalhesSalvos = await AsyncStorage.getItem('favoritosDetalhes');
    let detalhesArray = detalhesSalvos ? JSON.parse(detalhesSalvos) : [];

    if (favoritosArray.includes(id)) {
      // Remover dos favoritos
      favoritosArray = favoritosArray.filter((favId: string) => favId !== id);
      detalhesArray = detalhesArray.filter((item: any) => item.id.toString() !== id);
    } else {
      // Adicionar aos favoritos
      favoritosArray.push(id);
      const filmeSelecionado = filmeObj || filmes.find(f => f.id.toString() === id);
      if (filmeSelecionado && !detalhesArray.some((item: any) => item.id === filmeSelecionado.id)) {
        detalhesArray.push(filmeSelecionado);
      }
    }
    setFavoritos(favoritosArray);
    await AsyncStorage.setItem('favoritos', JSON.stringify(favoritosArray));
    await AsyncStorage.setItem('favoritosDetalhes', JSON.stringify(detalhesArray));
  };

  const filmesFiltrados = filmes.filter(f =>
    f.name.toLowerCase().includes(busca.toLowerCase())
  );

  const avaliarEstrela = (id: string, nota: number) => {
    const novoEstado = { ...estrelas, [id]: nota };
    salvarEstrelas(novoEstado);
  };

  const renderEstrelas = (id: string) => {
    const nota = estrelas[id] || 0;
    let estrelasArr = [];
    for (let i = 1; i <= 5; i++) {
      estrelasArr.push(
        <TouchableOpacity key={i} onPress={() => avaliarEstrela(id, i)}>
          <Ionicons
            name={i <= nota ? 'star' : 'star-outline'}
            size={22}
            color="#FFD166"
            style={{ marginHorizontal: 1 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 4 }}>{estrelasArr}</View>;
  };

  const renderItem = ({ item }: any) => {
    const isFavorito = favoritos.includes(item.id.toString());

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('Detalhes', { filme: item })}
        >
          <Image source={{ uri: item.image?.medium }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.titulo}>{item.name}</Text>
            <Text style={styles.genero}>{item.genres.join(', ') || 'Sem gênero'}</Text>
            {renderEstrelas(item.id.toString())}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alternarFavorito(item.id.toString(), item)}>
          <Ionicons
            name={isFavorito ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorito ? '#FFD166' : '#073B3A'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD166" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFD166', textAlign: 'center', marginTop: 40 }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com a logo no canto esquerdo */}
      <View style={styles.headerContainer}>
        <Image source={LOGO} style={styles.logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar filmes..."
        placeholderTextColor="#5E3023"
        value={busca}
        onChangeText={setBusca}
      />
      {/* Botão Favoritos centralizado */}
      <View style={styles.favButtonWrapper}>
        <TouchableOpacity
          style={styles.favButtonMain}
          onPress={() => navigation.navigate('Favoritos')}
        >
          <Ionicons name="heart" size={26} color="#F4F1DE" />
          <Text style={styles.favButtonText}>Favoritos</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sugestoes}>Sugestões de filmes</Text>
      {filmesFiltrados.length === 0 ? (
        <Text style={{ color: '#F4F1DE', textAlign: 'center', marginTop: 40 }}>Nenhum item encontrado.</Text>
      ) : (
        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#073B3A', paddingTop: 0, paddingHorizontal: 0 },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD166',
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 18,
    justifyContent: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#5E3023',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: '#F4F1DE',
    fontSize: 16,
    color: '#5E3023',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  favButtonWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  favButtonMain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E3023',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  favButtonText: {
    color: '#F4F1DE',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  sugestoes: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD166',
    marginLeft: 24,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F4F1DE',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#5E3023',
  },
  imagem: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#e2e8f0',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E3023',
    marginBottom: 6,
  },
  genero: {
    fontSize: 15,
    color: '#073B3A',
  },
});