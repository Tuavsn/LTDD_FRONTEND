import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { strings } from '@/constants/String';
import { useToast } from '@/components/SimpleToastProvider';
import { api } from '@/utils/restApiUtil';

const background = require('@/assets/images/login-background.png');

type ConfirmNewPasswordParams = {
  email: string;
};

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
    api.post('/auth/reset-password', { email, newPassword }).then((res) => {
      if (!res.success)
        showToast(res.message || strings.confirmNewPassword.errors.error, 2000);
      else router.dismissTo('/(auth)/login');
    });
  };

  const handleCancelClick = () => {
    router.dismissTo('/(auth)/login');
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {strings.confirmNewPassword.labels.title}
            </Text>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.confirmNewPassword.labels.newPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          {/* Confirm New Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.confirmNewPassword.labels.confirmNewPassword}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          {/* Submit Button */}
          <View style={styles.inputContainer}>
            <Button mode="contained" onPress={handleSubmitNewPassword}>
              {strings.confirmNewPassword.labels.submit}
            </Button>
          </View>

          {/* Cancel Button */}
          <View style={styles.inputContainer}>
            <Button mode="text" onPress={handleCancelClick}>
              {strings.confirmNewPassword.texts.cancel}
            </Button>
          </View>
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
    flexDirection: 'column',
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
    fontSize: 32, fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
});

export default ConfirmNewPassword;
