import { useToast } from '@/components/SimpleToastProvider'
import { strings } from '@/constants/String'
import { api } from '@/utils/restApiUtil'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ImageBackground, SafeAreaView, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
const background = require('@/assets/images/login-background.png')

function ForgottPasswordScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmitEmail = () => {
    api.post('/auth/forgot-password', { email }, false).then((res) => {
      if (!res.success)
        showToast(res.message || strings.forgotPassword.errors.error, 2000);
      else
        router.navigate({ pathname: '/(auth)/(forgot-password)/confirm-otp', params: { email } });
    });
  }

  const handleBackToLoginClick = () => {
    router.back();
  }

  return (
    <ImageBackground source={background}
      className='flex-1 flex justify-center h-full w-full'>
      <View className='flex-1 flex self-center w-full'>
        <SafeAreaView className='flex flex-1 flex-col justify-center self-center p-5 w-[80%]'>
          <View className='mb-4 flex content-center items-center bg-[rgba(255,255,255,0.8)] p-4 w-min'>
            <Text className='text-[32px] font-bold w-min'>{strings.forgotPassword.labels.title}</Text>
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.forgotPassword.labels.email}
              value={email}
              onChangeText={setEmail}
              mode='outlined'
              keyboardType='email-address'
            />
          </View>

          <Button
            mode='contained'
            onPress={handleSubmitEmail}
            className='mb-4 mt-2'
          >
            {strings.forgotPassword.labels.submit}
          </Button>

          <Button
            mode='text'
            className='mt-2'
            onPress={handleBackToLoginClick}
          >
            {strings.forgotPassword.texts.backToLogin}
          </Button>

        </SafeAreaView>
      </View>
    </ImageBackground>
  )
}

export default ForgottPasswordScreen