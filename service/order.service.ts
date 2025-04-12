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
}

export default OrderService;