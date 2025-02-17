// app/(tabs)/cart.tsx
import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';

const CartScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <Text style={styles.message}>Hiện tại giỏ hàng của bạn trống.</Text>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});
