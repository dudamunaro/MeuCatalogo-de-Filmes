import React from 'react';
import { ScrollView, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Detalhes() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const filme = route.params?.filme;

  if (!filme) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Detalhes do filme não disponíveis.</Text>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Filmes')}>
          <Text style={styles.textoBotaoVoltar}>Voltar para Filmes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: filme.image?.original }} style={styles.imagem} />
      <Text style={styles.titulo}>{filme.name}</Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Gênero:</Text> {Array.isArray(filme.genres) && filme.genres.length > 0 ? filme.genres.join(', ') : 'Sem gênero'}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Ano:</Text> {filme.premiered?.split('-')[0]}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Duração:</Text> {filme.runtime} min
      </Text>
      <Text style={styles.sinopse}>{filme.summary?.replace(/<[^>]+>/g, '')}</Text>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Filmes')}>
        <Text style={styles.textoBotaoVoltar}>Voltar para Filmes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#073B3A',
    padding: 16,
  },
  imagem: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#e2e8f0',
    borderWidth: 2,
    borderColor: '#5E3023',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5E3023',
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#FFD166',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  info: {
    fontSize: 16,
    color: '#073B3A',
    marginBottom: 6,
    backgroundColor: '#FFD166',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#5E3023',
  },
  sinopse: {
    marginTop: 16,
    fontSize: 16,
    color: '#5E3023',
    lineHeight: 22,
    textAlign: 'justify',
    backgroundColor: '#F4F1DE',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFD166',
  },
  errorText: {
    fontSize: 18,
    color: '#FFD166',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    marginTop: 24,
    backgroundColor: '#5E3023',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  textoBotaoVoltar: {
    color: '#F4F1DE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});