import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar, Text, View } from 'react-native';
import {
    Header,
    Slideshow,
    CategoryList,
    BestSellingProducts,
    ProductListLazyLoad,
} from '../../components';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Danh sách sản phẩm sử dụng FlatList chính */}
      <ProductListLazyLoad
        ListHeaderComponent={() => (
          <View>
            {/* Slide Show */}
            <Slideshow />

            {/* Danh mục sản phẩm */}
            <Text style={styles.sectionHeader}>Danh mục sản phẩm</Text>
            <CategoryList />

            {/* Sản phẩm bán chạy */}
            <Text style={styles.sectionHeader}>Sản phẩm bán chạy</Text>
            <BestSellingProducts />

            {/* Tất cả sản phẩm */}
            <Text style={styles.sectionHeader}>Tất cả sản phẩm</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
