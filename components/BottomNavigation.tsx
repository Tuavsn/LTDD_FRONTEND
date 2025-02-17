// components/BottomNavigation.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BottomNavigation = () => {
  const handleHomePress = () => {
    console.log('Home pressed');
  };

  const handleCartPress = () => {
    console.log('Cart pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={handleHomePress}>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCartPress}>
        <Text style={styles.navText}>Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProfilePress}>
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eee',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
