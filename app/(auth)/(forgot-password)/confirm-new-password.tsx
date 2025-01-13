import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { ImageBackground, SafeAreaView, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { strings } from '@/constants/String'
import { useToast } from '@/components/SimpleToastProvider';
import { api } from '@/utils/restApiUtil';
const background = require('@/assets/images/login-background.png')

type ConfirmNewPasswordParams = {
  email: string;
}

function ConfirmNewPassword() {
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { email } = useLocalSearchParams() as ConfirmNewPasswordParams;

  const handleSubmitNewPassword = () => {
    if (newPassword !== confirmNewPassword) {
      showToast(strings.confirmNewPassword.errors.passwordNotMatch, 2000);
      return;
    }
    api.post('/auth/reset-password', { email, newPassword }, false).then((res) => {
      if (!res.success)
        showToast(res.message || strings.confirmNewPassword.errors.error, 2000);
      else
        router.dismissTo('/(auth)/login');
    });
  }

  const handleCancelClick = () => {
    router.dismissTo('/(auth)/login');
  }

  return (
    <ImageBackground source={background}
      className='flex-1 flex justify-center h-full w-full'>
      <View className='flex-1 flex self-center w-full'>
        <SafeAreaView className='flex flex-1 flex-col justify-center self-center p-5 w-[80%]'>
          <View className='mb-4 flex content-center items-center bg-[rgba(255,255,255,0.8)] p-4 w-min'>
            <Text className='text-[32px] font-bold w-min'>{strings.confirmNewPassword.labels.title}</Text>
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.confirmNewPassword.labels.newPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              mode='outlined'
              secureTextEntry
            />
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.confirmNewPassword.labels.confirmNewPassword}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              mode='outlined'
              secureTextEntry
            />
          </View>
          <View className='mb-4'>
            <Button mode='contained' onPress={handleSubmitNewPassword}>{strings.confirmNewPassword.labels.submit}</Button>
          </View>
          <View className='mb-4'>
            <Button mode='text' onPress={handleCancelClick}>{strings.confirmNewPassword.texts.cancel}</Button>
          </View>
        </SafeAreaView>
      </View >
    </ImageBackground >
  )
}

export default ConfirmNewPassword