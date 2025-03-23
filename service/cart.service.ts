import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Cart } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

class CartService {
  /**
   * Lấy giỏ hàng của người dùng dựa theo userId.
   * @param userId ID của người dùng
   * @returns Promise<Cart>
   */
  static async getCart(userId: string): Promise<Cart> {
    const url = `${ApiEndPoint.CART}/${userId}`;
    const res = await api.get<Cart>(url, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }

  /**
   * Thêm sản phẩm vào giỏ hàng.
   * Yêu cầu body: { userId, productId, quantity }
   * @param userId ID của người dùng
   * @param productId ID của sản phẩm
   * @param quantity Số lượng sản phẩm cần thêm
   * @returns Promise<Cart>
   */
  static async addItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const url = `${ApiEndPoint.CART}/add`;
    const res = await api.post<Cart>(url, { userId, productId, quantity }, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng.
   * Yêu cầu body: { userId, productId, quantity }
   * @param userId ID của người dùng
   * @param productId ID của sản phẩm
   * @param quantity Số lượng mới
   * @returns Promise<Cart>
   */
  static async updateItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const url = `${ApiEndPoint.CART}/update`;
    const res = await api.put<Cart>(url, { userId, productId, quantity }, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }

  /**
   * Xóa một sản phẩm khỏi giỏ hàng.
   * Yêu cầu body: { userId, productId }
   * @param userId ID của người dùng
   * @param productId ID của sản phẩm cần xóa
   * @returns Promise<Cart>
   */
  static async removeItem(userId: string, productId: string): Promise<Cart> {
    const url = `${ApiEndPoint.CART}/remove`;
    const res = await api.post<Cart>(url, { userId, productId }, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }

  /**
   * Xóa toàn bộ sản phẩm khỏi giỏ hàng của người dùng.
   * Yêu cầu body: { userId }
   * @param userId ID của người dùng
   * @returns Promise<Cart>
   */
  static async clearCart(userId: string): Promise<Cart> {
    const url = `${ApiEndPoint.CART}/clear`;
    const res = await api.post<Cart>(url, { userId }, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }


  /**
   * Thanh toán giỏ hàng.
   * Yêu cầu body: { address, phone, paymentMethod }
   * @param userId ID của người dùng
   * @returns Promise<Cart>
   */
  static async checkout(address: string, phone: string, paymentMethod: string): Promise<{ cart: Cart }> {
    const url = `${ApiEndPoint.CART}/checkout`;
    const res = await api.post<{ cart: Cart }>(url, { address, phone, paymentMethod }, { requiresAuth: true });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }
}

export default CartService;
