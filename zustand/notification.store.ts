// notificationStore.js
import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type NotificationStore = {
  expoPushToken: string | null;
  init: () => Promise<void>;
  displayNotification: (title?: string, body?: string) => Promise<void>;
};

const useNotificationStore = create<NotificationStore>((set, get) => ({
  expoPushToken: null,

  // Hàm khởi tạo và đăng ký quyền thông báo
  init: async () => {
    // Yêu cầu quyền thông báo
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Xin lỗi, chúng tôi không thể nhận thông báo!');
      return;
    }

    // Lấy Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log('Expo Push Token:', token);
    set({ expoPushToken: token });

    // Cấu hình channel cho Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  },

  // Hàm hiển thị thông báo local qua expo-notifications
  displayNotification: async (title = 'Thông Báo Mới', body = 'Bạn có một thông báo mới') => {
    console.log("Trying to display notification", { title, body });
    // Kiểm tra xem đã có token chưa
    const { expoPushToken } = get();
    if (!expoPushToken) {
      console.log("No expoPushToken found, skipping notification display.");
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Hiển thị ngay lập tức
    });
  },
}));

export default useNotificationStore;
