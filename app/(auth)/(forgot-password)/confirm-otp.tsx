import React, { useEffect, useState } from 'react'
import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { strings } from '@/constants/String';
import { router } from 'expo-router';
import { useToast } from '@/components/SimpleToastProvider';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { api } from '@/utils/restApiUtil';
const background = require('@/assets/images/login-background.png')

type ConfirmOTPScreenParams = {
  email: string;
}

function ConfirmOTPScreen() {
  const { email } = useLocalSearchParams() as ConfirmOTPScreenParams;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const { showToast } = useToast();

  const handleSubmitOTP = () => {
    api.post('/auth/verify-otp', { email, otp }, false).then((res) => {
      if (res.success) {
        showToast(strings.otpConfirm.texts.otpSuccess, 2000);
        router.replace({ pathname: '/(auth)/(forgot-password)/confirm-new-password', params: { email } });
      } else {
        showToast(strings.otpConfirm.errors.error, 2000);
      }
    })
  }
  const handleResendOTP = () => {
    setTimer(60);

    api.post('/auth/resend-otp', { email }, false).then((res) => {
      showToast(res.message || strings.otpConfirm.errors.error, 2000);
    });

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleBackToLoginClick = () => {
    router.dismissTo('/(auth)/login');
  }

  const OTPResend = () => {
    if (timer === 0) {
      return (
        <Button
          mode='text'
          onPress={handleResendOTP}
          className='focus:bg-slate-400'
        >
          {strings.otpConfirm.texts.resendOTP}
        </Button>
      )
    } else {
      return (
        <Button
          mode='text'
          className='focus:bg-slate-400'
        >
          {strings.otpConfirm.texts.resendOTPIn} {timer} {strings.otpConfirm.texts.seconds}
        </Button>
      )
    }
  }

  return (
    <ImageBackground source={background}
      className='flex-1 flex justify-center h-full w-full'>
      <View className='flex-1 flex self-center w-full'>
        <SafeAreaView className='flex flex-1 flex-col justify-center self-center p-5 w-[80%]'>
          <View className='mb-4 flex content-center items-center bg-[rgba(255,255,255,0.8)] p-4 w-min'>
            <Text className='text-[32px] font-bold w-min'>{strings.otpConfirm.labels.title}</Text>
          </View>
          <View className='mb-4'>
            <TextInput
              label={strings.otpConfirm.labels.otp}
              value={otp}
              onChangeText={setOtp}
              mode='outlined'
              keyboardType='decimal-pad'
            />
          </View>
          <View>
            <OTPResend />
          </View>

          <Button
            mode='contained'
            onPress={handleSubmitOTP}
            className='mb-4 mt-2'
          >
            {strings.otpConfirm.labels.confirm}
          </Button>

          <Button
            mode='text'
            className='mt-2'
            onPress={handleBackToLoginClick}
          >
            {strings.otpConfirm.texts.backToLogin}
          </Button>

        </SafeAreaView>
      </View>
    </ImageBackground>
  )
}

export default ConfirmOTPScreen