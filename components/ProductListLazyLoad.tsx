// components/ProductListLazyLoad.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { Product } from '@/constants/Types';
import ProductService from '@/service/product.service';
import { useRouter } from 'expo-router';

interface ProductListLazyLoadProps {
  ListHeaderComponent?: () => JSX.Element;
}

const ProductListLazyLoad: React.FC<ProductListLazyLoadProps> = ({ ListHeaderComponent }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mỗi lần load 10 sản phẩm
  const itemsPerPage = 100;
  const [page, setPage] = useState<number>(1);
  const [displayedData, setDisplayedData] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const numColumns = 2;

  const flatListRef = useRef<FlatList<Product>>(null);

  const router = useRouter();

  // Fetch sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res: Product[] = await ProductService.getAllProducts();
        setProducts(res);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cập nhật displayedData dựa trên page và danh sách sản phẩm (sắp xếp theo giá tăng dần)
  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    const endIndex = page * itemsPerPage;
    setDisplayedData(sortedProducts.slice(0, endIndex));
  }, [page, products]);

  // Hàm load thêm sản phẩm
  const handleLoadMore = () => {
    if (displayedData.length < products.length) {
      setIsLoadingMore(true);
      // Giả lập thời gian tải (ví dụ 1.5 giây)
      setTimeout(() => {
        setPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 1500);
    }
  };

  // Khi người dùng kéo xong (end drag), kiểm tra nếu kéo thêm quá ngưỡng thì trigger load thêm
  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const threshold = 50; // Ngưỡng kéo thêm (50px)
    if (contentOffset.y > contentSize.height - layoutMeasurement.height + threshold) {
      handleLoadMore();
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => router.push({
        pathname: `/product-detail`,
        params: { productId: item._id }
      })}
    >
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
          <Text style={styles.priceCurrency}> VND</Text>
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.ratingText}>★ {item.rating} - </Text>
          <Text style={styles.soldText}>Đã bán: {item.soldCount}</Text>
        </View>
        <Text style={styles.productCategory}>
          Category: {item.category && typeof item.category === 'object' ? item.category.name : item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        key={`grid-${numColumns}`}
        data={displayedData}
        keyExtractor={(item) =>
          (item._id ? item._id.toString() : item._id ? item._id.toString() : Math.random().toString())
        }
        renderItem={renderItem}
        onScrollEndDrag={onScrollEndDrag}
        onEndReachedThreshold={0.1}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator style={styles.loadingIndicator} /> : null}
      />
    </View>
  );
};

export default ProductListLazyLoad;

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  listContainer: {
    paddingHorizontal: 2,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    margin: 4,
    borderRadius: 5,
    flex: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
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
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
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
  loadingIndicator: {
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
