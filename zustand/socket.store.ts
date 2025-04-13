import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import useNotificationStore from './notification.store';
import { OrderState } from '@/constants/Enum';

const SOCKET_SERVER_URL = `http://${process.env.EXPO_PUBLIC_SOCKET_SERVER_HOST}:${process.env.EXPO_PUBLIC_SOCKET_SERVER_PORT}`;

interface SocketState {
  socket: {
    instance: Socket | null;
    showToast: Function;
  } | null;
  initSocket: (showToast: Function, userId: string) => void;
  disconnectSocket: (userId: string) => void;
  emitEvent: (event: string, data: any) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  initSocket: (showToast: Function, userId: string) => {
    // Khởi tạo kết nối socket với server
    const socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    // Lắng nghe các sự kiện từ server (ví dụ, kết nối thành công)
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id); // In ra ID socket khi kết nối thành công
      socketInstance.emit('message', 'Hello from client!'); // Gửi tin nhắn đến server khi kết nối thành công
      socketInstance.emit('registerUser', { userId, socketId: socketInstance.id }); // Gửi userId đến server khi kết nối thành công
    });

    socketInstance.on('disconnect', (socket) => {
      socketInstance.emit('unregisterUser', { userId }); // Gửi userId đến server khi ngắt kết nối
    });

    socketInstance.on('orderStatusChanged', (data: { orderId: string, status: string }) => {
      console.log('Order status changed:', data);
      useNotificationStore.getState().displayNotification(
        'Order Status Changed',
        `Order ${data.orderId} status changed to ${data.status}`
      );
      get().socket?.showToast(
        `Đơn hàng ${data.orderId} đã được cập nhật trạng thái ${OrderState[data.status as keyof typeof OrderState].toLocaleLowerCase()}`,
      );
    });

    set({ socket: { instance: socketInstance, showToast } });
  },
  disconnectSocket: (userId: string) => {
    const { socket } = get();
    if (socket?.instance) {
      socket.instance.emit('unregisterUser', { userId, socketId: socket.instance.id }); // Gửi userId đến server khi ngắt kết nối
      socket.instance.disconnect();
      set({ socket: null });
    }
  },
  emitEvent: (event: string, data: any) => {
    const { socket } = get();
    if (socket?.instance) {
      socket.instance.emit(event, data);
    }
  },
}));
