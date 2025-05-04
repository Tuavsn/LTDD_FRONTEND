import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Platform, StatusBar, Alert,
  Modal,
  TextInput
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CartItem, Product } from '@/constants/Types';
import ProductService from '@/service/product.service';
import CartService from '@/service/cart.service';
import { useUserInfoStore } from '@/zustand/user.store';
import ProductRating from '@/components/ProductRating';
import { BlurView } from 'expo-blur';
import { formatNumberCommas } from '@/utils/string.utils';

const ProductDetailScreen = () => {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openInputItemDetail, setOpenInputItemDetail] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const user = useUserInfoStore(state => state.auth.user);
  const router = useRouter();
  const [next, setNext] = React.useState(Function);

  useFocusEffect(
    useCallback(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await ProductService.getProductById(productId as string);
          setProduct(res);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };

      if (productId) {
        fetchProduct();
      }
    }, [productId])
  );

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        if (productId) {
          const result = await ProductService.getSimilarProducts(productId as string);
          setSimilarProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await CartService.addItem(user._id, productId as string, quantity);
      Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng.');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const handleBuyNow = () => {
    let newCartItems: CartItem[] = [];
    const newCartItem: CartItem = {
      product: product as Product,
      quantity: quantity,
    };
    newCartItems.push(newCartItem);

    router.navigate({ pathname: '/(checkout)', params: { cartStr: JSON.stringify(newCartItem || []) } });
  }

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

  const ratingCounts = product.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // Hàm giảm số lượng (đảm bảo không giảm xuống dưới 0)
  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    if (next) {
      next();
    }
    setOpenInputItemDetail(false);
  }

  const ItemDetailInput = ({ }) => (
    <View style={styles.itemDetailContainer}>
      <View style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => setOpenInputItemDetail(false)} style={styles.button}>
          <Text style={{ color: '#EA1916', fontWeight: 'bold' }}>Đóng</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Nhập số lượng</Text>
      <View style={styles.inputContainer}>
        {/* Nút giảm */}
        <TouchableOpacity onPress={handleDecrease} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        {/* Trường nhập số lượng */}
        <TextInput
          value={String(quantity)}
          onChangeText={text => setQuantity(Number(text))}
          keyboardType="numeric"
          style={styles.textInput}
        />
        {/* Nút tăng */}
        <TouchableOpacity onPress={handleIncrease} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        Tổng tiền:
      </Text>
      <View style={styles.inputContainer}>
        <Text style={{ color: '#EA1916' }}>
          {formatNumberCommas(product.price * quantity)} VND
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConfirm} style={{ ...styles.button, paddingVertical: 15, borderRadius: 40 }}>
          <Text style={{ color: '#16EA19', fontWeight: 'bold', fontSize: 18 }}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const handleOpenInputItemDetailForBuyNow = () => {
    setNext(() => handleBuyNow);
    setOpenInputItemDetail(true);
  }
  const handleOpenInputItemDetailForAddToCart = () => {
    setNext(() => handleAddToCart);
    setOpenInputItemDetail(true);
  }

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openInputItemDetail}
        onRequestClose={() => setOpenInputItemDetail(false)}
        style={styles.modalContainer}
      >
        <BlurView
          intensity={80}
          tint="dark"
          style={styles.absolute}
          onTouchEnd={() => setOpenInputItemDetail(false)}
        />
        <View style={styles.modalContent}>
          <ItemDetailInput />
        </View>
      </Modal>
      <Image
        source={{ uri: product.image?.[0]?.url || '' }}
        style={styles.productImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>
          {product.price.toLocaleString('vi-VN')} NVD
        </Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.rating}>★ {product.rating}</Text>
          <Text style={styles.sold}>Đã bán: {product.soldCount}</Text>
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={handleOpenInputItemDetailForBuyNow}>
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleOpenInputItemDetailForAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Similar products slider */}
      {similarProducts.length > 0 && (
        <View style={styles.similarContainer}>
          <Text style={styles.similarTitle}>Sản phẩm tương tự</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarProducts.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.similarItem}
                onPress={() => router.push({ pathname: `/product-detail`, params: { productId: item._id } })}
              >
                <Image
                  source={{ uri: item.image?.[0]?.url || '' }}
                  style={styles.similarImage}
                />
                <Text numberOfLines={1} style={styles.similarName}>{item.name}</Text>
                <Text style={styles.similarPrice}>
                  {item.price.toLocaleString('vi-VN')}đ
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Product Rating - Chỉ hiển thị đánh giá, không có nút viết đánh giá */}
      <ProductRating
        productId={productId as string}
        averageRating={product.rating}
        totalReviews={product.reviewCount}
        ratingCounts={ratingCounts}
        showReviewButton={false}
      />

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
  similarContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  similarItem: {
    width: 140,
    marginRight: 12,
  },
  similarImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  similarName: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  similarPrice: {
    fontSize: 14,
    color: '#EA1916',
    fontWeight: 'bold',
  },
  // Container của modal bao phủ toàn màn hình với nền tối mờ.
  modalContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%'
  },
  // Style dùng cho BlurView phủ toàn màn hình.
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Nội dung của modal (form chỉnh sửa).
  modalContent: {
    width: '96%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    position: 'absolute',
    marginLeft: '2%',
    bottom: 10,
  },
  itemDetailContainer: {
    width: '100%',
    margin: 10,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // hoặc space-between nếu muốn căn đều
  },
  button: {
    backgroundColor: '#EEE',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 80,
    height: 40,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 60,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  }
});