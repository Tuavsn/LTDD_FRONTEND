import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="confirm-otp" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="confirm-otp" />
    </Stack>
  )
}