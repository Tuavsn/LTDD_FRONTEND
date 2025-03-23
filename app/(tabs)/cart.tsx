import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartService from '@/service/cart.service';
import { Cart, CartItem } from '@/constants/Types';
import { router, useFocusEffect } from 'expo-router';
import { useUserInfoStore } from '@/zustand/user.store';

const CartScreen = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const user = useUserInfoStore(state => state.auth.user);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await CartService.getCart(user._id);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckout = () => {
    console.log('cart', cart);
    router.navigate({ pathname: '/(checkout)', params: { cartStr: JSON.stringify(cart) } })
  };

  // Tự động refetch mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await CartService.updateItem(user._id, productId, quantity);
      if (cart) {
        const updatedItems = cart.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        );
        setCart({ ...cart, items: updatedItems });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng.');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await CartService.removeItem(user._id, productId);
      if (cart) {
        const updatedItems = cart.items.filter(item => item.product._id !== productId);
        setCart({ ...cart, items: updatedItems });
      }
    } catch (error) {
      console.error('Error removing product:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
  };

  const handleClearCart = async () => {
    try {
      await CartService.clearCart(user._id);
      setCart({ ...(cart as Cart), items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Lỗi', 'Không thể xóa giỏ hàng.');
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image?.[0]?.url || '' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text>Số lượng: {item.quantity}</Text>
        <Text style={styles.itemPrice}>{item.product.price.toLocaleString('vi-VN')}đ</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#EA1916" />
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#EA1916" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.product._id)}
          >
            <Ionicons name="trash" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleClearCart}>
        <Ionicons name="trash-bin" size={28} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#EA1916" />
      ) : cart && cart.items.length > 0 ? (
        <FlatList
          data={cart.items}
          keyExtractor={(item) => item.product._id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <Text style={styles.message}>Hiện tại giỏ hàng của bạn trống.</Text>
      )}
      {
        cart && cart.items.length > 0 &&
        <TouchableOpacity style={styles.payButton} disabled={!cart || cart.items.length === 0}
          onPress={handleCheckout}>
          <Text style={styles.payButtonText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      }
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  headerContainer: {
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#EA1916',
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    marginHorizontal: 8,
  },
  removeButton: {
    marginLeft: 12,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  payButton: {
    backgroundColor: '#EA1916',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});