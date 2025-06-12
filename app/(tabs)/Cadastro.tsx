import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const salvarCadastro = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const dados = { email, senha };
    await AsyncStorage.setItem('usuario', JSON.stringify(dados));
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    navigation.replace('Login'); // ou `navigation.goBack()` se preferir
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#5E3023"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#5E3023"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.botao} onPress={salvarCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotaoVoltar}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#073B3A',
  },
  titulo: {
    fontSize: 32,
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFD166',
    letterSpacing: 1,
    backgroundColor: '#5E3023',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#5E3023',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#F4F1DE',
    fontSize: 16,
    color: '#5E3023',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  botao: {
    backgroundColor: '#5E3023',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#FFD166',
    fontWeight: 'bold',
    fontSize: 18,
  },
  botaoVoltar: {
    backgroundColor: '#FFD166',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  textoBotaoVoltar: {
    color: '#5E3023',
    fontWeight: 'bold',
    fontSize: 16,
  },
});