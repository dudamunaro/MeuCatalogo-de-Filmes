import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Favoritos() {
  const navigation = useNavigation<any>();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    setCarregando(true);
    const data = await AsyncStorage.getItem('favoritosDetalhes');
    if (data) {
      setFavoritos(JSON.parse(data));
    } else {
      setFavoritos([]);
    }
    setCarregando(false);
  };

  // Para remover dos favoritos
  const removerFavorito = async (id: string) => {
    const novosFavoritos = favoritos.filter((item: any) => item.id.toString() !== id);
    setFavoritos(novosFavoritos);
    await AsyncStorage.setItem('favoritosDetalhes', JSON.stringify(novosFavoritos));
    // Atualiza também a lista de IDs simples
    await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos.map((item: any) => item.id.toString())));
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate('Detalhes', { filme: item })}
      >
        <Image source={{ uri: item.image?.medium }} style={styles.imagem} />
        <View style={styles.info}>
          <Text style={styles.titulo}>{item.name}</Text>
          <Text style={styles.genero}>{item.genres?.join(', ') || 'Sem gênero'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removerFavorito(item.id.toString())}>
        <Ionicons name="trash" size={26} color="#FFD166" />
      </TouchableOpacity>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD166" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Meus Favoritos</Text>
      </View>
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => navigation.navigate('Filmes')}
      >
        <Ionicons name="arrow-back" size={22} color="#FFD166" />
        <Text style={styles.voltarButtonText}>Voltar para Filmes</Text>
      </TouchableOpacity>
      {favoritos.length === 0 ? (
        <Text style={styles.semFavoritos}>Nenhum filme ou série favoritado ainda.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Meu Catálogo de Filmes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#073B3A', paddingTop: 0, paddingHorizontal: 0 },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFD166',
    paddingVertical: 28,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#5E3023',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5E3023',
  },
  voltarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  voltarButtonText: {
    color: '#FFD166',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  semFavoritos: {
    color: '#F4F1DE',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
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
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFD166',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerText: {
    color: '#5E3023',
    fontSize: 15,
    fontWeight: 'bold',
  },
});