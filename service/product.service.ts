import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Product } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

interface ProductFilter {
    category?: string;
    sortBy?: 'price' | 'soldCount' | string;
    order?: 'asc' | 'desc' | string;
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
        const res = await api.get<Product>(url);
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
}

export default ProductService;
