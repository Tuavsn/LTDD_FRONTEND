// components/Header.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, User } from '@/constants/Types';
const DefaultAvatar = require('../assets/images/Default-Avatar.png');
import { useFocusEffect, useRouter } from 'expo-router';
import { useUserInfoStore } from '@/zustand/user.store';

const Header = () => {
  const user = useUserInfoStore(state => state.auth.user);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState<Product[]>([]);

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
          <Text style={styles.userName}>{user?.fullname || 'Guest'}</Text>
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
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexGrow: 1
  },
  searchResultsList: {
    position: 'absolute',
    top: 50, // Hiển thị ngay dưới ô tìm kiếm
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 100, // Đảm bảo hiển thị trên cùng
    elevation: 5, // Hiển thị bóng trên Android
    paddingVertical: 5,
    maxHeight: 300, // Giới hạn chiều cao danh sách
  },
  searchResultItem: {
    flexDirection: 'row', // Bố cục ngang (ảnh bên trái, thông tin bên phải)
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  searchProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Cho phép thông tin sản phẩm chiếm hết phần còn lại
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EA1916',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFB80A',
    marginRight: 10,
  },
  soldText: {
    fontSize: 12,
    color: '#666',
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

