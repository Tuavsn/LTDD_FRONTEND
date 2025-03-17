import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Platform, StatusBar, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product } from '@/constants/Types';
import ProductService from '@/service/product.service';
import CartService from '@/service/cart.service';

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userId = "67bbdafc0c2703b0f2aeabbb"; // Cần thay thế bằng userId thực tế

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductService.getProductById(productId as string);
        setProduct(res);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const quantity = 1;
      await CartService.addItem(userId, productId as string, quantity);
      Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng.');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA1916" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy sản phẩm!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image?.[0]?.url || '' }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')}đ</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.rating}>★ {product.rating}</Text>
          <Text style={styles.sold}>Đã bán: {product.soldCount}</Text>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  infoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA1916',
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    color: '#FFB80A',
  },
  sold: {
    fontSize: 16,
    color: '#666',
  },
  buyButton: {
    backgroundColor: '#EA1916',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#FF9900',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});