import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { strings } from '@/constants/String';
import { RelativePathString, router } from 'expo-router';
import { useToast } from '@/components/SimpleToastProvider';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { api } from '@/utils/restApiUtil';

const background = require('@/assets/images/login-background.png');

type ConfirmOTPScreenParams = {
  email: string;
  nextPathname: string;
};

function ConfirmOTPScreen() {
  const { email, nextPathname } = useLocalSearchParams() as ConfirmOTPScreenParams;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const { showToast } = useToast();

  const handleSubmitOTP = () => {
    api.post('/auth/verify-otp', { email, otp }).then((res) => {
      if (res.success) {
        showToast(strings.otpConfirm.texts.otpSuccess, 2000);
        router.replace({
          pathname: nextPathname as RelativePathString,
          params: { email },
        });
      } else {
        showToast(strings.otpConfirm.errors.error, 2000);
      }
    });
  };

  const handleResendOTP = () => {
    setTimer(60);
    api.post('/auth/resend-otp', { email }).then((res) => {
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
  };

  const handleCancel = () => {
    router.back();
  };

  const OTPResend = () => {
    if (timer === 0) {
      return (
        <Button mode="text" onPress={handleResendOTP}>
          {strings.otpConfirm.texts.resendOTP}
        </Button>
      );
    } else {
      return (
        <Button mode="text" disabled>
          {strings.otpConfirm.texts.resendOTPIn} {timer}{' '}
          {strings.otpConfirm.texts.seconds}
        </Button>
      );
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Title */}
          <View style={styles.titleBox}>
            <Text style={styles.title}>{strings.otpConfirm.labels.title}</Text>
          </View>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.otpConfirm.labels.otp}
              value={otp}
              onChangeText={setOtp}
              mode="outlined"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Resend OTP */}
          <View>{OTPResend()}</View>

          {/* Submit Button */}
          <Button mode="contained" onPress={handleSubmitOTP} style={styles.submitBtn}>
            {strings.otpConfirm.labels.confirm}
          </Button>

          {/* Cancel Button */}
          <Button mode="text" onPress={handleCancel} style={styles.cancelBtn}>
            {strings.otpConfirm.texts.cancel}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    width: '80%',
  },
  titleBox: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  cancelBtn: {
    marginTop: 8,
  },
});

export default ConfirmOTPScreen;
