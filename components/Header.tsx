// components/Header.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, User } from '@/constants/Types';
const DefaultAvatar = require( '../assets/images/Default-Avatar.png'); // Đảm bảo file này tồn tại trong thư mục assets/images
import { useRouter } from 'expo-router';
import ProductService from '@/service/product.service';

const Header = () => {
  const fields = ["fullname", "email", "phone"];
  
  const [user, setUser] = useState(Object.fromEntries(fields.map((field) => [field, ''])));

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        AsyncStorage.getItem('user').then((user) => setUser(JSON.parse(user ?? `{${fields.join(": ''")} }`)));
      } catch (e) {
        console.log(e);
      }
    };
    loadUser();
  }, []);

  const handleBack = () => {
    // Xử lý khi bấm nút Back
    router.back();
  };

  const handleUserIcon = () => {
    // Điều hướng đến màn hình profile
    router.push('/(profile)');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await ProductService.searchProducts(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchResults.length > 0 && (
          <FlatList
            style={styles.searchResultsList}
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResultItem} 
                onPress={() => router.push(`/product/${item._id}`)}
              >
                {/* Ảnh sản phẩm */}
                <Image 
                  source={{ uri: item.image && item.image.length > 0 ? item.image[0].url : '' }} 
                  style={styles.searchProductImage} 
                />

                {/* Thông tin sản phẩm */}
                <View style={styles.textContainer}>
                  <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    {item.price.toLocaleString('vi-VN')}đ
                  </Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.ratingText}>★ {item.rating}</Text>
                    <Text style={styles.soldText}>Đã bán: {item.soldCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.userIcon} onPress={() => router.push('/(profile)')}>
        <View style={styles.userContainer}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : DefaultAvatar}
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

