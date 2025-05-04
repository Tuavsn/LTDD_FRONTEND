import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ProductService from '@/service/product.service';
import { useUserInfoStore } from '@/zustand/user.store';
import { useRouter } from 'expo-router';

// Define types for ratings and reviews
interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  images?: Array<{ url: string }>;
}

interface PaginatedReviewResult {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface ProductRatingProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
  showReviewButton?: boolean; // Added prop to control whether to show review button
  ratingCounts?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const ProductRating = ({ productId, averageRating, totalReviews, showReviewButton = false, ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }: ProductRatingProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [totalReviewCount, setTotalReviewCount] = useState(totalReviews);
  const user = useUserInfoStore(state => state.auth.user);
  const router = useRouter();
  const [hasReviewed, setHasReviewed] = useState(false);

  const loadReviews = async (options: { page: number, limit: number, rating: number | null }) => {
    try {
      options.page === 1 ? setLoading(true) : setLoadingMore(true);
      
      const result: PaginatedReviewResult = await ProductService.getProductReviews(
        productId,
        options
      );
      
      if (options.page === 1) {
        setReviews(result.reviews);
      } else {
        setReviews(prev => [...prev, ...result.reviews]);
      }
      
      setHasMorePages(result.currentPage < result.totalPages);
      setTotalReviewCount(result.total);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Lỗi', 'Không thể tải đánh giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const checkUserReview = async () => {
    if (user?._id) {
      try {
        const hasReviewed = await ProductService.hasUserReviewedProduct(user._id, productId);
        setHasReviewed(hasReviewed);
      } catch (error) {
        console.error('Error checking user review:', error);
      }
    }
  };

  useEffect(() => {
    // Load initial data
    loadReviews({ page: 1, limit: 10, rating: selectedRating });
    
    // Check if user has already reviewed
    if (showReviewButton) {
      checkUserReview();
    }
    
    // Load rating statistics
    const loadRatingStats = async () => {
      try {
        const stats = await ProductService.getProductRatingStats(productId);
        // If the parent component doesn't provide rating counts, use the ones from API
        if (!ratingCounts || Object.values(ratingCounts).every(v => v === 0)) {
          ratingCounts = stats.ratingCounts;
        }
      } catch (error) {
        console.error('Error loading rating stats:', error);
      }
    };
    
    loadRatingStats();
  }, [productId, user, showReviewButton]);

  useEffect(() => {
    // Reset page and reload reviews when rating filter changes
    setPage(1);
    loadReviews({ page: 1, limit: 10, rating: selectedRating });
  }, [selectedRating]);

  const handleLoadMore = () => {
    if (hasMorePages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews({ page: nextPage, limit: 10, rating: selectedRating });
    }
  };

  const filterReviewsByRating = (rating: number | null) => {
    if (rating === selectedRating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };
  
  const deleteReview = async (reviewId: string) => {
    if (!user) return;
    
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa đánh giá này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ProductService.deleteProductReview(reviewId);
              // Reload reviews after deletion
              loadReviews({ page: 1, limit: 10, rating: selectedRating });
              setHasReviewed(false);
              
              // Refresh product rating stats
              const stats = await ProductService.getProductRatingStats(productId);
              ratingCounts = stats.ratingCounts;
              
              Alert.alert('Thành công', 'Đã xóa đánh giá.');
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Lỗi', 'Không thể xóa đánh giá.');
            }
          }
        }
      ]
    );
  };

  const calculatePercentage = (count: number) => {
    if (totalReviewCount === 0) return 0;
    return Math.min((count / totalReviewCount) * 100, 100);
  };  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign 
          key={i} 
          name={i <= rating ? "star" : "staro"} 
          size={16} 
          color={i <= rating ? "#FFB80A" : "#ccc"} 
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = calculatePercentage(count);
    
    return (
      <TouchableOpacity 
        style={styles.ratingBarContainer}
        onPress={() => filterReviewsByRating(rating)}
      >
        <Text style={styles.ratingNumber}>{rating}</Text>
        <AntDesign name="star" size={14} color="#FFB80A" />
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${percentage}%` },
              selectedRating === rating ? { backgroundColor: '#EA1916' } : {}
            ]} 
          />
        </View>
        <Text style={styles.ratingCount}>{count}</Text>
      </TouchableOpacity>
    );
  };

  const renderReviewItem = (review: Review) => {
    const isOwnReview = user && review.userId._id === user._id;
    
    return (
      <View style={styles.reviewItem} key={review._id}>
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            {review.userId.avatar ? (
              <Image source={{ uri: review.userId.avatar }} style={styles.userAvatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>{review.userId.name.charAt(0)}</Text>
              </View>
            )}
            <View>
              <Text style={styles.userName}>{review.userId.name}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
                <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
              </View>
            </View>
          </View>
          
          {isOwnReview && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteReview(review._id)}
            >
              <AntDesign name="delete" size={18} color="#EA1916" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        {review.images && review.images.length > 0 && (
          <View style={styles.reviewImages}>
            {review.images.map((image, index) => (
              <Image key={index} source={{ uri: image.url }} style={styles.reviewImage} />
            ))}
          </View>
        )}
      </View>
    );
  };

  const navigateToWriteReview = () => {
    if (!user) {
      Alert.alert(
        'Đăng nhập',
        'Vui lòng đăng nhập để đánh giá sản phẩm.',
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Đăng nhập', 
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
      return;
    }
    
    if (hasReviewed) {
      Alert.alert('Thông báo', 'Bạn đã đánh giá sản phẩm này rồi.');
      return;
    }
    
    router.push({
      pathname: '/(review)/product-review',
      params: { productId }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
      
      <View style={styles.ratingOverview}>
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(averageRating))}
            <Text style={styles.totalReviews}>{totalReviewCount} đánh giá</Text>
          </View>
        </View>
        
        <View style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map(rating => (
            renderRatingBar(rating, ratingCounts[rating as keyof typeof ratingCounts] || 0)
          ))}
        </View>
      </View>

      {selectedRating !== null && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterText}>Đang lọc: {selectedRating} sao</Text>
          <TouchableOpacity onPress={() => setSelectedRating(null)}>
            <Text style={styles.clearFilter}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EA1916" />
        </View>
      ) : reviews.length > 0 ? (
        <>
          {reviews.map(review => renderReviewItem(review))}
          
          {loadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#EA1916" />
            </View>
          )}
          
          {hasMorePages && !loadingMore && (
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.seeMoreText}>Xem thêm đánh giá</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.noReviews}>
          {selectedRating 
            ? `Không có đánh giá ${selectedRating} sao nào.` 
            : 'Chưa có đánh giá nào cho sản phẩm này.'}
        </Text>
      )}
      
      {/* Chỉ hiển thị nút đánh giá khi showReviewButton là true */}
      {showReviewButton && (
        <TouchableOpacity 
          style={[
            styles.writeReviewButton,
            hasReviewed ? styles.disabledButton : null
          ]}
          onPress={navigateToWriteReview}
        >
          <Text style={styles.writeReviewText}>
            {hasReviewed ? 'Bạn đã đánh giá' : 'Viết đánh giá'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  ratingOverview: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  averageRatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingRight: 16,
    width: '30%',
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#EA1916',
  },
  starsContainer: {
    alignItems: 'center',
  },
  totalReviews: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  ratingBars: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFB80A',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  clearFilter: {
    fontSize: 14,
    color: '#EA1916',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  noReviews: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    padding: 20,
  },
  seeMoreButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#333',
    fontWeight: '500',
  },
  writeReviewButton: {
    backgroundColor: '#EA1916',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  writeReviewText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ProductRating;