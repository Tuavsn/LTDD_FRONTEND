import React, { useState } from "react";
import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { strings } from "@/constants/String";
import { api } from "@/utils/restApiUtil";
import { router } from "expo-router";

export default function RegisterScreen() {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateData = () => {

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !phone || !password || !confirmPassword) {
      setError(strings.register.errors.fullInformationRequired);
      return;
    }

    if (!emailRegex.test(email)) {
      setError(strings.register.errors.error);
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError(strings.register.errors.error);
      return;
    }

    if (password !== confirmPassword) {
      setError(strings.register.errors.passwordNotMatch);
      return
    }

    setError('');
  }

  const handleRegister = () => {

    // validateData();

    // api.post('/auth/register', { email, phone, password, confirmPassword }, false).then((res) => {
    //   if (res.success) {
    //     router.navigate('/(tabs)');
    //   } else {
    //     setError(res.message || strings.register.errors.error);
    //   }
    // });

    router.navigate('/(auth)/(register)/confirm-otp');
  }

  const handleLoginClick = () => {
    router.back();
  }


  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      className='flex-1 flex justify-center h-full w-full'
    >
      <View className='flex-1 flex self-center w-full'>
        <SafeAreaView className='flex flex-1 flex-col justify-center self-center p-5 w-[80%]' >
          <View className='mb-4 flex content-center items-center bg-[rgba(255,255,255,0.8)] p-4 w-min'>
            <Text className='text-[32px] font-bold w-min'>{strings.register.labels.title}</Text>
          </View>

          <View className='mb-4'>
            <TextInput
              label={strings.register.labels.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>


          <View className='mb-4'>
            <TextInput
              label={strings.register.labels.phone}
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
            />
          </View>

          <View className='mb-4'>
            <TextInput
              label={strings.register.labels.password}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          <View className='mb-4'>
            <TextInput
              label={strings.register.labels.confirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleRegister} className='mt-[10px] bg-cyan-400'>
            {strings.register.labels.register}
          </Button>
          <Button onPress={handleLoginClick} className='mt-[10px]'>
            {strings.register.texts.backToLogin}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground >
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    alignSelf: 'center'
  }, container: {
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
    fontWeight: 700,
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
});