import { ApiEndPoint } from "@/constants/ApiEndPoint";
import { Order } from "@/constants/Types";
import { api } from "@/utils/restApiUtil";

class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    const url = ApiEndPoint.ORDER;
    const res = await api.get<{ orders: Order[] }>(url);
    if (res.success) {
      return res.data?.orders ?? [];
    } else {
      throw new Error(res.message);
    }
  }

  static async cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
    const url = `${ApiEndPoint.ORDER}/cancel/${orderId}`;
    const res = await api.put(url, null);
    if (res.success) {
      return { success: true };
    } else {
      return { success: false, message: res.message };
    }
  }

  /**
   * Thanh toán đơn hàng.
   * Yêu cầu: cartItems, address, phone, paymentMethod, discountCode
   * @param cartItems Danh sách sản phẩm trong giỏ hàng
   * @param address Địa chỉ giao hàng
   * @param phone Số điện thoại người nhận
   * @param paymentMethod Phương thức thanh toán
   * @param discountCode Mã giảm giá (nếu có)
   * */
  static async checkoutOrder(cartItems: any, address: string, phone: string, paymentMethod: string, discountCode: string) {
    const url = `${ApiEndPoint.ORDER}/checkout`;
    const res = await api.post(url, { cartItems, address, phone, paymentMethod, discountCode });
    if (res.success) {
      return res.data!;
    } else {
      throw new Error(res.message);
    }
  }
}

export default OrderService;