import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '../constants/Types';
import CategoryService from '@/service/category.service';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: Category[] = await CategoryService.getAllCategories();
        setCategories(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push({
        pathname: `/product-list`,
        params: { categoryId: item._id }
      })} // Điều hướng đến ProductListScreen
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 2,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
});
