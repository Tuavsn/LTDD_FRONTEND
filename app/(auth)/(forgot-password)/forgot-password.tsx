import React, { useState } from 'react';
import { router } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useToast } from '@/components/SimpleToastProvider';
import { strings } from '@/constants/String';
import { api } from '@/utils/restApiUtil';

const background = require('@/assets/images/login-background.png');

function ForgottPasswordScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmitEmail = () => {
    api.post('/auth/forgot-password', { email }).then((res) => {
      if (!res.success)
        showToast(res.message || strings.forgotPassword.errors.error, 2000);
      else
        router.navigate({
          pathname: '/(common)/confirm-otp',
          params: {
            email,
            nextPathname: "/(auth)/(forgot-password)/confirm-new-password",
          },
        });
    });
  };

  const handleBackToLoginClick = () => {
    router.back();
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.containerView}>
        <SafeAreaView style={styles.safeArea}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {strings.forgotPassword.labels.title}
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.forgotPassword.labels.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
            />
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmitEmail}
            style={styles.submitButton}
          >
            {strings.forgotPassword.labels.submit}
          </Button>

          {/* Back Button */}
          <Button
            mode="text"
            onPress={handleBackToLoginClick}
            style={styles.backButton}
          >
            {strings.forgotPassword.texts.backToLogin}
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
  containerView: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20, width: '80%',
  },
  titleContainer: {
    marginBottom: 16, alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16, alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8, marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
});

export default ForgottPasswordScreen;
