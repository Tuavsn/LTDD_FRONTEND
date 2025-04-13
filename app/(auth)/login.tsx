import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/utils/restApiUtil';
import { strings } from '@/constants/String';
import { useUserInfoStore } from '@/zustand/user.store';
import { User } from '@/constants/Types';
import { useSocketStore } from '@/zustand/socket.store';
import { useToast } from '@/components/SimpleToastProvider';

const LoginScreen = () => {
  const initSocket = useSocketStore(state => state.initSocket);
  const router = useRouter();
  const [email, setEmail] = useState('vkq265@gmail.com');
  const [password, setPassword] = useState('qwerty');
  const [error, setError] = useState('');
  const auth = useUserInfoStore(state => state.auth);
  const setAuth = useUserInfoStore(state => state.setAuth);
  const { showToast } = useToast();

  useEffect(() => {
    if (auth.token) {
      router.replace('/(tabs)/home');
    }
  }, [auth]);

  const handleLogin = () => {
    if (!email || !password) {
      setError(strings.login.errors.fullInformationRequired);
      return;
    }
    setError('');
    api.post<{ suggestEnterOtp: boolean | undefined, token: string, user: User }>('/auth/login', { email, password }).then((res) => {
      if (res.success) {
        setAuth({ token: res.data?.token || '', user: res.data?.user || {} as User });
        AsyncStorage.setItem('token', res.data?.token || '');
        initSocket(showToast, res.data?.user?._id || '');
      } else {
        if (res.data?.suggestEnterOtp) {
          router.navigate({ pathname: '/(common)/confirm-otp', params: { email } });
        }
        setError(res.message || strings.login.errors.error);
      }
    });
  };

  const handleRegisterClick = () => router.navigate('/(auth)/register');
  const handleForgotPasswordClick = () => router.navigate('/(auth)/(forgot-password)/forgot-password');

  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      style={styles.background}
    >
      <View style={styles.mainView}>
        <SafeAreaView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.login.labels.title}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.login.labels.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.login.labels.password}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              onSubmitEditing={handleLogin}
              style={styles.textInput}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleLogin} style={styles.loginButton} labelStyle={styles.buttonLabel}>
            {strings.login.labels.login}
          </Button>
          <Button onPress={handleRegisterClick} style={styles.registerButton} labelStyle={styles.buttonLabel}>
            {strings.login.texts.navigateRegister}
          </Button>
          <Button onPress={handleForgotPasswordClick} style={styles.forgotPasswordButton} labelStyle={styles.buttonLabel}>
            {strings.login.texts.navigateForgotPassword}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Center content vertically in the background
  },
  mainView: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    width: '80%',
  },
  titleContainer: {
    marginBottom: 16,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // letting the container size fit its content
  },
  title: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    // You can customize further (e.g., borderRadius, padding) if needed.
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: 'cyan',
  },
  registerButton: {
    marginTop: 14,
  },
  forgotPasswordButton: {
    marginTop: 6,
  },
  buttonLabel: {
    // This helps ensure consistent typography on buttons (if needed)
    fontSize: 16,
  }
});

export default LoginScreen;
