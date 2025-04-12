import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ProductService from '@/service/product.service';
import { useUserInfoStore } from '@/zustand/user.store';
import { Product } from '@/constants/Types';
import { uploadImage } from '@/service/cloudinary.service';

const CreateReviewScreen = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const user = useUserInfoStore(state => state.auth.user);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<{ uri: string; uploaded?: boolean; url?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin sản phẩm');
      router.back();
      return;
    }

    if (!user) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đánh giá sản phẩm');
      router.replace('/(auth)/login');
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productData = await ProductService.getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
        router.back();
      } finally {
        setProductLoading(false);
      }
    };

    const checkUserReview = async () => {
      try {
        const hasReviewed = await ProductService.hasUserReviewedProduct(user._id, productId);
        if (hasReviewed) {
          Alert.alert('Thông báo', 'Bạn đã đánh giá sản phẩm này rồi');
          router.back();
        }
      } catch (error) {
        console.error('Error checking user review:', error);
      }
    };

    fetchProductDetails();
    checkUserReview();
  }, [productId, user, router]);

  const handleSelectRating = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert('Thông báo', 'Bạn chỉ có thể tải lên tối đa 5 ảnh');
      return;
    }

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để tải ảnh lên');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5 - images.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({ uri: asset.uri }));
        const combinedImages = [...images, ...newImages];
        
        // Only take the first 5 images if more are selected
        setImages(combinedImages.slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImages = async (): Promise<Array<{ url: string }>> => {
    if (images.length === 0) return [];
    
    setIsUploading(true);
    const uploadedImages: Array<{ url: string }> = [];
    
    try {
      for (const image of images) {
        // Skip already uploaded images
        if (image.uploaded && image.url) {
          uploadedImages.push({ url: image.url });
          continue;
        }
        
        // Use the new uploadImage function
        const uploadResult = await uploadImage(image.uri);
        
        if (uploadResult && uploadResult.secure_url) {
          uploadedImages.push({ url: uploadResult.secure_url });
        } else {
          console.error('Upload result missing secure_url:', uploadResult);
        }
      }
      
      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const submitReview = async () => {
    if (!user || !productId) {
      Alert.alert('Lỗi', 'Thiếu thông tin người dùng hoặc sản phẩm');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nhận xét của bạn về sản phẩm');
      return;
    }

    setIsLoading(true);
    
    try {
      // First upload images if any
      let uploadedImages: Array<{ url: string }> = [];
      if (images.length > 0) {
        uploadedImages = await uploadImages();
      }
      
      // Then create the review
      const reviewData = {
        userId: user._id,
        productId,
        rating: Number(rating), // ép kiểu rõ ràng
        comment: comment.trim(),
        images: uploadedImages.length > 0 ? uploadedImages : undefined
      };
      
      await ProductService.createProductReview(reviewData);
      
      Alert.alert(
        'Thành công', 
        'Cảm ơn bạn đã đánh giá sản phẩm',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => handleSelectRating(i)}
          style={styles.starButton}
        >
          <AntDesign 
            name={i <= rating ? "star" : "staro"} 
            size={32} 
            color={i <= rating ? "#FFB80A" : "#ccc"} 
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (productLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA1916" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      {product && (
        <View style={styles.productInfo}>
          <Image 
            source={{ uri: product.image[0].url }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
      )}

      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
        {renderStars()}
        <Text style={styles.ratingText}>
          {rating === 5 ? 'Rất hài lòng' : 
           rating === 4 ? 'Hài lòng' :
           rating === 3 ? 'Bình thường' :
           rating === 2 ? 'Không hài lòng' : 'Rất không hài lòng'}
        </Text>
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>Nhận xét</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.imagesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hình ảnh</Text>
          <Text style={styles.optionalText}>(Tùy chọn, tối đa 5 ảnh)</Text>
        </View>
        
        <View style={styles.imageGrid}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <AntDesign name="closecircle" size={18} color="#EA1916" />
              </TouchableOpacity>
            </View>
          ))}
          
          {images.length < 5 && (
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={pickImages}
            >
              <AntDesign name="camerao" size={24} color="#999" />
              <Text style={styles.addImageText}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, (isLoading || isUploading) && styles.disabledButton]}
        onPress={submitReview}
        disabled={isLoading || isUploading}
      >
        {isLoading || isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EA1916',
  },
  ratingSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  commentSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  imagesSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionalText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#EA1916',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateReviewScreen;