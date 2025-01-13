import React, { useState } from "react";
import { ImageBackground, SafeAreaView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { strings } from "@/constants/String";
import { api } from "@/utils/restApiUtil";
import { router } from "expo-router";

export default function RegisterScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
  }

  const handleLoginClick = () => {
    router.back();
  }


  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      style={styles.background}
    >
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.container} >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.register.labels.title}</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            {strings.register.labels.register}
          </Button>
          <Button onPress={handleLoginClick} style={styles.button}>
            {strings.register.texts.navigateLogin}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground >
  )
}

const styles = {
  background: {},
  backgroundContainer: {},
  container: {},
  titleContainer: {},
  title: {},
  input: {},
  error: {},
  button: {},
}