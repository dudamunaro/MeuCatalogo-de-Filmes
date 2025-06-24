import React, { useEffect, useState } from 'react';
import { ScrollView, Image, Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Detalhes() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const filme = route.params?.filme;

  const [comentario, setComentario] = useState('');
  const [feedbacks, setFeedbacks] = useState<{email: string, texto: string}[]>([]);
  const [usuario, setUsuario] = useState<{email: string} | null>(null);
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [comentarioEditado, setComentarioEditado] = useState('');

  useEffect(() => {
  carregarFeedbacks();
  carregarUsuario();
  setEditandoIdx(null);
  setComentarioEditado('');
  setComentario('');
}, [filme]);

  const carregarUsuario = async () => {
    const user = await AsyncStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  };

  const carregarFeedbacks = async () => {
    if (!filme) return;
    const data = await AsyncStorage.getItem(`feedbacks_${filme.id}`);
    if (data) setFeedbacks(JSON.parse(data));
    else setFeedbacks([]);
  };

  const salvarFeedback = async () => {
    if (!comentario.trim()) {
      Alert.alert('Atenção', 'Digite um comentário.');
      return;
    }
    if (!usuario) {
      Alert.alert('Atenção', 'Usuário não identificado.');
      return;
    }
    const novoFeedback = { email: usuario.email, texto: comentario.trim() };
    const novosFeedbacks = [...feedbacks, novoFeedback];
    await AsyncStorage.setItem(`feedbacks_${filme.id}`, JSON.stringify(novosFeedbacks));
    setFeedbacks(novosFeedbacks);
    setComentario('');
  };

  const removerFeedback = async (idx: number) => {
  if (!usuario) return;
  if (feedbacks[idx].email !== usuario.email) {
    Alert.alert('Atenção', 'Você só pode apagar seus próprios comentários.');
    return;
  }
  Alert.alert(
    'Remover comentário',
    'Tem certeza que deseja remover este comentário?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const novosFeedbacks = feedbacks.filter((_, i) => i !== idx);
          await AsyncStorage.setItem(`feedbacks_${filme.id}`, JSON.stringify(novosFeedbacks));
          setFeedbacks(novosFeedbacks);
          setEditandoIdx(null);
        }
      }
    ]
  );
};

  const iniciarEdicao = (idx: number, texto: string) => {
    setEditandoIdx(idx);
    setComentarioEditado(texto);
  };

  const salvarEdicao = async (idx: number) => {
    if (!comentarioEditado.trim()) {
      Alert.alert('Atenção', 'Digite um comentário.');
      return;
    }
    const novosFeedbacks = feedbacks.map((item, i) =>
      i === idx ? { ...item, texto: comentarioEditado.trim() } : item
    );
    await AsyncStorage.setItem(`feedbacks_${filme.id}`, JSON.stringify(novosFeedbacks));
    setFeedbacks(novosFeedbacks);
    setEditandoIdx(null);
    setComentarioEditado('');
  };

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

      {/* Seção de Feedbacks */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitulo}>Comentários</Text>
        <FlatList
          data={feedbacks}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackEmail}>{item.email}</Text>
              {editandoIdx === index ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={comentarioEditado}
                    onChangeText={setComentarioEditado}
                    multiline
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                    <TouchableOpacity style={styles.botaoFeedbackMini} onPress={() => salvarEdicao(index)}>
                      <Text style={styles.textoBotaoFeedback}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoFeedbackMini} onPress={() => setEditandoIdx(null)}>
                      <Text style={styles.textoBotaoFeedback}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.feedbackTexto}>{item.texto}</Text>
                  {usuario && usuario.email === item.email && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                      <TouchableOpacity style={styles.botaoFeedbackMini} onPress={() => iniciarEdicao(index, item.texto)}>
                        <Text style={styles.textoBotaoFeedback}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.botaoFeedbackMini} onPress={() => removerFeedback(index)}>
                        <Text style={styles.textoBotaoFeedback}>Apagar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.semFeedback}>Nenhum comentário ainda.</Text>}
        />
        <TextInput
          style={styles.input}
          placeholder="Deixe seu comentário..."
          placeholderTextColor="#5E3023"
          value={comentario}
          onChangeText={setComentario}
          multiline
        />
        <TouchableOpacity style={styles.botaoFeedback} onPress={salvarFeedback}>
          <Text style={styles.textoBotaoFeedback}>Enviar Comentário</Text>
        </TouchableOpacity>
      </View>

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
  feedbackContainer: {
    marginTop: 28,
    backgroundColor: '#F4F1DE',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD166',
  },
  feedbackTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E3023',
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackItem: {
    marginBottom: 12,
    backgroundColor: '#FFD166',
    borderRadius: 8,
    padding: 8,
  },
  feedbackEmail: {
    color: '#5E3023',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  feedbackTexto: {
    color: '#073B3A',
    fontSize: 15,
  },
  semFeedback: {
    color: '#5E3023',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#5E3023',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#5E3023',
    marginTop: 10,
    marginBottom: 8,
    fontSize: 15,
    minHeight: 40,
  },
  botaoFeedback: {
    backgroundColor: '#5E3023',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botaoFeedbackMini: {
    backgroundColor: '#5E3023',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  textoBotaoFeedback: {
    color: '#FFD166',
    fontWeight: 'bold',
    fontSize: 16,
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