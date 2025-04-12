import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Product } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

interface ProductFilter {
    category?: string;
    sortBy?: 'price' | 'soldCount' | string;
    order?: 'asc' | 'desc' | string;
}

interface ReviewData {
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    images?: Array<{ url: string }>;
}

interface ReviewQueryOptions {
    page?: number;
    limit?: number;
    rating?: number | null;
}

interface PaginatedReviewResult {
    reviews: Array<{
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
    }>;
    totalPages: number;
    currentPage: number;
    total: number;
}

class ProductService {
    /**
     * Lấy danh sách sản phẩm với các tiêu chí lọc (nếu có)
     * @param filter {ProductFilter} Các tiêu chí lọc: category, minPrice, maxPrice
     * @returns Promise<Product[]>
     */
    static async getAllProducts(filter?: ProductFilter): Promise<Product[]> {
        const url = ApiEndPoint.PRODUCT;
        let query = "";
        if (filter) {
            const queryParams = new URLSearchParams();
            if (filter.category) queryParams.append("category", filter.category);
            if (filter.sortBy) queryParams.append("sortBy", filter.sortBy);
            if (filter.order) queryParams.append("order", filter.order);
            query = "?" + queryParams.toString();
        }
        const res = await api.get<Product[]>(url + query);
        if (res.success) {
            return res.data ?? [];
        } else {
            throw new Error(res.message);
        }
    }

    static async getBestSellerProducts(): Promise<Product[]> {
        const url = `${ApiEndPoint.PRODUCT}/best-seller`;
        const res = await api.get<Product[]>(url);
        if (res.success) {
            return res.data ?? [];
        } else {
            throw new Error(res.message);
        }
    }

    static async getProductById(productId: string): Promise<Product> {
        const url = `${ApiEndPoint.PRODUCT}/${productId}`;
        const res = await api.get<Product>(url, {});
        if (res.success) {
            return res.data!;
        } else {
            throw new Error(res.message);
        }
    }

    static async createProduct(product: Product): Promise<Product> {
        const url = ApiEndPoint.PRODUCT;
        const res = await api.post<Product>(url, product);
        if (res.success) {
            return res.data!;
        } else {
            throw new Error(res.message);
        }
    }

    static async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
        const url = `${ApiEndPoint.PRODUCT}/${productId}`;
        const res = await api.put<Product>(url, product);
        if (res.success) {
            return res.data!;
        } else {
            throw new Error(res.message);
        }
    }

    static async deleteProduct(productId: string): Promise<boolean> {
        const url = `${ApiEndPoint.PRODUCT}/${productId}`;
        const res = await api.delete(url);
        if (res.success) {
            return true;
        } else {
            throw new Error(res.message);
        }
    }

    static async searchProducts(query: string): Promise<Product[]> {
        const url = `${ApiEndPoint.PRODUCT}/search?q=${encodeURIComponent(query)}`;
        const res = await api.get<Product[]>(url);
        if (res.success) {
            return res.data ?? [];
        } else {
            throw new Error(res.message);
        }
    }

    // Review-related functions
    
    /**
     * Lấy đánh giá của một sản phẩm theo ID với phân trang và lọc
     * @param productId ID của sản phẩm cần lấy đánh giá
     * @param options Tùy chọn lọc và phân trang
     * @returns Promise<PaginatedReviewResult>
     */
    static async getProductReviews(
        productId: string, 
        options: ReviewQueryOptions = {}
    ): Promise<PaginatedReviewResult> {
        const { page = 1, limit = 10, rating = null } = options;
        
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        
        if (rating !== null) {
            queryParams.append('rating', rating.toString());
        }
        
        const url = `${ApiEndPoint.REVIEW}/product/${productId}?${queryParams.toString()}`;
        const res = await api.get<PaginatedReviewResult>(url);
        
        if (res.success) {
            return res.data!;
        } else {
            throw new Error(res.message);
        }
    }
    
    /**
     * Tạo một đánh giá mới cho sản phẩm
     * @param reviewData Dữ liệu đánh giá
     * @returns Promise với đánh giá đã tạo
     */
    static async createProductReview(reviewData: ReviewData): Promise<any> {
        const url = ApiEndPoint.REVIEW;
        const res = await api.post(url, reviewData, {});
        
        if (res.success) {
            return res.data;
        } else {
            throw new Error(res.message);
        }
    }
    
    /**
     * Xóa một đánh giá
     * @param reviewId ID của đánh giá cần xóa
     * @returns Promise với kết quả xóa
     */
    static async deleteProductReview(reviewId: string): Promise<{ success: boolean }> {
        const url = `${ApiEndPoint.REVIEW}/${reviewId}`;
        const res = await api.delete(url, {});
        
        if (res.success) {
            return { success: true };
        } else {
            throw new Error(res.message);
        }
    }
    
    /**
     * Lấy thống kê đánh giá của sản phẩm
     * @param productId ID sản phẩm
     * @returns Promise với thống kê đánh giá
     */
    static async getProductRatingStats(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingCounts: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        }
    }> {
        const url = `${ApiEndPoint.PRODUCT}/${productId}/rating-stats`;
        const res = await api.get(url);
        
        if (res.success) {
            return res.data!;
        } else {
            throw new Error(res.message);
        }
    }
    
    /**
     * Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
     * @param userId ID người dùng
     * @param productId ID sản phẩm
     * @returns Promise cho biết người dùng đã đánh giá chưa
     */
    static async hasUserReviewedProduct(userId: string, productId: string): Promise<boolean> {
        const url = `${ApiEndPoint.REVIEW}/check?userId=${userId}&productId=${productId}`;
        const res = await api.get<{ hasReviewed: boolean }>(url, {});
        
        if (res.success) {
            return res.data?.hasReviewed || false;
        } else {
            throw new Error(res.message);
        }
    }

    /**
     * Lấy danh sách sản phẩm tương tự theo ID sản phẩm
     * @param productId ID sản phẩm
     * @returns Promise<Product[]>
     */
    static async getSimilarProducts(productId: string): Promise<Product[]> {
        const url = `${ApiEndPoint.PRODUCT}/${productId}/similar`;
        const res = await api.get<Product[]>(url);
        
        if (res.success) {
            return res.data ?? [];
        } else {
            throw new Error(res.message);
        }
    }
}

export default ProductService;