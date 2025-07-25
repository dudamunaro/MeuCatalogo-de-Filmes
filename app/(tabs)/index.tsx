import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    setEmail('');
    setSenha('');
  }, [modoCadastro]);

  const salvarCadastro = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const dados = { email, senha };
    await AsyncStorage.setItem('usuario', JSON.stringify(dados));
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    setModoCadastro(false);
  };

  const realizarLogin = async () => {
    const dadosSalvos = await AsyncStorage.getItem('usuario');
    if (!dadosSalvos) {
      Alert.alert('Erro', 'Nenhum usuário cadastrado.');
      return;
    }

    const { email: emailSalvo, senha: senhaSalva } = JSON.parse(dadosSalvos);
    if (email === emailSalvo && senha === senhaSalva) {
      navigation.navigate('Filmes');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoCadastro ? 'Cadastro' : 'Login'}</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#5E3023"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#5E3023"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      {modoCadastro ? (
        <Button title="Cadastrar" color="#5E3023" onPress={salvarCadastro} />
      ) : (
        <Button title="Entrar" color="#5E3023" onPress={realizarLogin} />
      )}

      <TouchableOpacity onPress={() => setModoCadastro(!modoCadastro)}>
        <Text style={styles.link}>
          {modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </Text>
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
  link: {
    marginTop: 22,
    color: '#FFD166',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },
});