import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Category } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

class CategoryService {
    static async getAllCategories(): Promise<Category[]> {
        const url = ApiEndPoint.CATEGORY;
        const res = await api.get<Category[]>(url);
        if (res.success) {
            return res.data ?? [];
        } else {
            throw new Error(res.message);
        }
    }
}

export default CategoryService;