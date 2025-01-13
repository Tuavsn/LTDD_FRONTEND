import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { api } from '@/utils/restApiUtil';
import { strings } from '@/constants/String';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError(strings.login.errors.fullInformationRequired);
      return;
    }
    setError('');
    api.post('/auth/login', { email, password }, false).then((res) => {
      if (res.success) {
        router.navigate('/(tabs)');
      } else {
        setError(res.message || strings.login.errors.error);
      }
    });

  };

  const handleRegisterClick = () => router.navigate('/(auth)/(register)');

  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      style={styles.background}
    >
      <View style={styles.backgroundContainer}>

        <SafeAreaView style={styles.container} >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.login.labels.title}</Text>
          </View>
          <TextInput
            label={strings.login.labels.email}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label={strings.login.labels.password}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onSubmitEditing={handleLogin}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            {strings.login.labels.login}
          </Button>
          <Button onPress={handleRegisterClick}>
            {strings.login.texts.navigateRegister}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    maxWidth: width * 0.8,
    padding: 20
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingInline: 30,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'cyan',
  },
  background: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center', // Căn giữa nội dung trong ảnh nền
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    display: 'flex',
    alignSelf: 'center',
    paddingInline: 'auto'
  }
});

export default LoginScreen;
