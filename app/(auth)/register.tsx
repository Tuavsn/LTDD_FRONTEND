import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { strings } from "@/constants/String";
import { api } from "@/utils/restApiUtil";
import { router } from "expo-router";
import { useToast } from "@/components/SimpleToastProvider";

export default function RegisterScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateData = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !phone || !fullname || !password || !confirmPassword) {
      setError(strings.register.errors.fullInformationRequired);
      return;
    }

    if (!emailRegex.test(email)) {
      setError(strings.register.errors.emailInvalid);
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError(strings.register.errors.phoneInvalid);
      return;
    }

    if (password !== confirmPassword) {
      setError(strings.register.errors.passwordNotMatch);
      return;
    }

    if (password.length < 6) {
      setError(strings.register.errors.passwordLengthInvalid);
      return;
    }

    setError("");
  };

  const handleRegister = () => {
    validateData();

    if (error) {
      return;
    }
    api.post("/auth/register", { email, phone, fullname, password }).then((res) => {
      if (res.success) {
        router.push({ pathname: "/(common)/confirm-otp", params: { email, nextPathname: "/(auth)/login" } });
      } else {
        showToast(res.message || strings.register.errors.error, 2000);
      }
    });
  };

  const handleLoginClick = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('@/assets/images/login-background.png')}
      style={styles.background}     >
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.safeArea}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.register.labels.title}</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.register.labels.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.register.labels.phone}
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
            />
          </View>

          {/* Fullname Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.register.labels.fullname}
              value={fullname}
              onChangeText={setFullname}
              mode="outlined"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.register.labels.password}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              label={strings.register.labels.confirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
            />
          </View>

          {/* Error message */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
          >
            {strings.register.labels.register}
          </Button>

          {/* Back To Login Button */}
          <Button
            onPress={handleLoginClick}
            style={styles.loginButton}
          >
            {strings.register.texts.backToLogin}
          </Button>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  backgroundContainer: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
  safeArea: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    padding: 20,
    width: "80%",
  },
  titleContainer: {
    marginBottom: 16, alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 16, alignSelf: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 10, backgroundColor: "cyan",
  },
  loginButton: {
    marginTop: 10,
  },
});