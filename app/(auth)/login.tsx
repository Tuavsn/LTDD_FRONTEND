import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { api } from '@/utils/restApiUtil';
import { strings } from '@/constants/String';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserInfoStore } from '@/zustand/user.store';
import { User } from '@/constants/Types';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('vkq265@gmail.com');
  const [password, setPassword] = useState('qwerty');
  const [error, setError] = useState('');
  const auth = useUserInfoStore(state => state.auth);
  const setAuth = useUserInfoStore(state => state.setAuth);


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
      } else {
        if (res.data?.suggestEnterOtp)
          router.navigate({ pathname: '/(common)/confirm-otp', params: { email } });
        setError(res.message || strings.login.errors.error);
      }
    });

  };

  const handleRegisterClick = () => router.navigate('/(auth)/register');
  const handleForgotPasswordClick = () => router.navigate('/(auth)/(forgot-password)/forgot-password');

  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      className='flex-1 flex justify-center h-full w-full'
    >
      <View className='flex-1 flex self-center w-full'>
        <SafeAreaView className='flex flex-1 flex-col justify-center self-center p-5 w-[80%]' >
          <View className='mb-4 flex content-center items-center bg-[rgba(255,255,255,0.8)] p-4 w-min'>
            <Text className='text-[32px] font-bold w-min'>{strings.login.labels.title}</Text>
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.login.labels.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.login.labels.password}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              onSubmitEditing={handleLogin}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleLogin} className='mt-[10px] bg-cyan-400'>
            {strings.login.labels.login}
          </Button>
          <Button onPress={handleRegisterClick} className='mt-[14px]'>
            {strings.login.texts.navigateRegister}
          </Button>
          <Button onPress={handleForgotPasswordClick} className='mt-[6px]'>
            {strings.login.texts.navigateForgotPassword}
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
