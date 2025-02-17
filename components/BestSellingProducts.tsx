// components/BestSellingProducts.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Product } from '@/constants/Types';
import ProductService from '@/service/product.service';

const BestSellingProducts: React.FC = () => {

  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res: Product[] = await ProductService.getBestSellerProducts();
        setBestSellerProducts(res);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {/* Hình ảnh không có padding, chiếm 1/2 kích thước card */}
      <Image
        source={{ uri: item.image && item.image.length > 0 ? item.image[0].url : '' }}
        style={styles.productImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          <Text style={styles.priceValue}>
            {item.price.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.priceCurrency}>đ</Text>
        </Text>
        {/* Row hiển thị rating và soldCount */}
        <View style={styles.infoRow}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
          <Text style={styles.soldText}>Đã bán: {item.soldCount}</Text>
        </View>
        <Text style={styles.productCategory}>
          Category: {item.category.name}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bestSellerProducts}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default BestSellingProducts;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 2,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    width: 160,
    marginHorizontal: 4,
    borderRadius: 10,
    overflow: 'hidden', // đảm bảo image không vượt ra ngoài borderRadius
  },
  productImage: {
    width: '100%',
    height: 140, // chiếm 1/2 kích thước card (giả sử card ~160)
  },
  textContainer: {
    padding: 10,
  },
  productName: {
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  ratingText: {
    fontSize: 13,
    color: '#FFB80A',
  },
  soldText: {
    fontSize: 13,
    color: '#FFB80A',
  },
  productPrice: {
    color: '#EA1916',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 18,
    color: '#EA1916',
    fontWeight: 'bold',
  },
  priceCurrency: {
    fontSize: 12,
    color: '#EA1916',
  },
  productCategory: {
    marginTop: 5,
    fontStyle: 'italic',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
