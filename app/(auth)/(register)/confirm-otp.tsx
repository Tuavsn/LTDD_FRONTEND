import React, { useState } from 'react'
import { Dimensions, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { strings } from '@/constants/String';
import { router } from 'expo-router';
import { useToast } from '@/components/SimpleToastProvider';
const background = require('@/assets/images/login-background.png')

function ConfirmOTPScreen() {

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const { showToast } = useToast();

  const handleSubmitOTP = () => {
  }
  const handleResendOTP = () => {
    setTimer(60);

    showToast(strings.otpConfirm.texts.resendOTPSuccess, 2000);

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
    router.dismissTo('/(auth)/(register)');
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