// screens/OrderDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Order, Product } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailScreen = () => {
  // Lấy dữ liệu đơn hàng từ params, chuyển chuỗi JSON về đối tượng Order
  const order = JSON.parse(useLocalSearchParams().order as string) as Order;
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: { product: Product, quantity: number } }) => (
    <View style={styles.itemContainer}>
      {/* Hiển thị hình sản phẩm */}
      <Image
        source={{ uri: item.product.image[0].url }}
        style={styles.productImage}
      />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          {/* Icon hiển thị bên cạnh tên sản phẩm */}
          <Ionicons name="pricetag" size={20} color="#ff8c00" style={styles.icon} />
        </View>
        <Text style={styles.itemText}>Số lượng: {item.quantity}</Text>
        <Text style={styles.itemText}>Đơn giá: {item.product.price.toLocaleString()} VND</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết đơn hàng</Text>
        <Text style={styles.subtitle}>Mã đơn hàng: {order._id}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={order.items}
        keyExtractor={(item) => item.product._id}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={styles.footer}>
            {order.discount && (
              <View style={styles.discountContainer}>
                {/* Icon cho voucher */}
                <Ionicons name="ticket" size={20} color="#2e7d32" style={styles.icon} />
                <Text style={styles.voucher}>
                  Voucher: {order.discount.code} (-{order.discount.percentage}%)
                </Text>
              </View>
            )}
            <Text style={styles.total}>Tổng tiền: {order.totalPrice.toLocaleString()} VND</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation cho Android
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    flexShrink: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'flex-end',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  voucher: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
    marginLeft: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  icon: {
    marginRight: 4,
  },
});
