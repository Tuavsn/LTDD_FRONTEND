// components/Header.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/constants/Types';
const DefaultAvatar = require('../assets/images/Default-Avatar.png');
import { useFocusEffect, useRouter } from 'expo-router';
import { useUserInfoStore } from '@/zustand/user.store';

const Header = () => {
  const user = useUserInfoStore(state => state.auth.user);

  const router = useRouter();

  const handleBack = () => {
    // Xử lý khi bấm nút Back
    router.back();
  };

  const handleUserIcon = () => {
    // Điều hướng đến màn hình profile
    router.push('/(profile)/profile');
  };

  return (
    <View style={styles.headerContainer}>
      {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity> */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
      />

      <TouchableOpacity style={styles.userIcon} onPress={handleUserIcon}>
        <View style={styles.userContainer}>
          <Image
            source={user ? { uri: user.avatar } : DefaultAvatar}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user && user.fullname}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  userIcon: {
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  userName: {
    fontSize: 16,
  },
});
