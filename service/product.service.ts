import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Product } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

class ProductService {
    static async getAllProducts(): Promise<Product[]> {
        const url = ApiEndPoint.PRODUCT;
        const res = await api.get<Product[]>(url);
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
}

export default ProductService;