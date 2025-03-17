import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product } from '@/constants/Types';
import ProductService from '@/service/product.service';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const ProductListScreen = () => {
  const { categoryId } = useLocalSearchParams(); // Lấy categoryId từ URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Các state cho sort
  const [sortBy, setSortBy] = useState<string>('');
  const [order, setOrder] = useState<string>('asc');

  // Hàm gọi API sản phẩm với các tham số filter và sort
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await ProductService.getAllProducts({ category: categoryId as string, sortBy, order });
      setProducts(res);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API khi category, sortBy hoặc order thay đổi
  useEffect(() => {
    if (categoryId) fetchProducts();
  }, [categoryId, sortBy, order]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        router.push({
          pathname: `/product-detail`,
          params: { productId: item._id },
        })
      }
    >
      <Image source={{ uri: item.image?.[0]?.url || '' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
        <View style={styles.productStats}>
          <Text style={styles.rating}>★ {item.rating}</Text>
          <Text style={styles.sold}>Đã bán: {item.soldCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Dropdown sort */}
      <View style={styles.sortContainer}>
        <FontAwesome name="sort" size={18} color="#fff" style={styles.sortIcon} />
        <Picker
          selectedValue={sortBy + '-' + order}
          style={styles.picker}
          onValueChange={(itemValue) => {
            const [sort, ord] = itemValue.split('-');
            setSortBy(sort);
            setOrder(ord);
          }}
        >
          <Picker.Item label="Mặc định" value="-" />
          <Picker.Item label="Giá tăng dần" value="price-asc" />
          <Picker.Item label="Giá giảm dần" value="price-desc" />
          <Picker.Item label="Đã bán tăng dần" value="soldCount-asc" />
          <Picker.Item label="Đã bán giảm dần" value="soldCount-desc" />
        </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#EA1916" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA1916',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sortIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 5,
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
  productStats: {
    flexDirection: 'row',
    marginTop: 5,
  },
  rating: {
    fontSize: 12,
    color: '#FFB80A',
    marginRight: 10,
  },
  sold: {
    fontSize: 12,
    color: '#666',
  },
});
