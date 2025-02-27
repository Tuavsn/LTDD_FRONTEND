import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type ToastItem = {
  message: string;
  duration: number;
};

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Sử dụng ref để lưu queue các toast
  const queue = useRef<ToastItem[]>([]);

  const processQueue = () => {
    // Nếu không có toast đang hiển thị và queue không rỗng
    if (!visible && queue.current.length > 0) {
      const nextToast = queue.current.shift()!;
      setMessage(nextToast.message);
      setVisible(true);
      // Hiệu ứng fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        timeoutRef.current = setTimeout(() => {
          // Hiệu ứng fade out
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
            setMessage('');
            // Sau khi toast hiện tại kết thúc, tiếp tục hiển thị toast kế tiếp trong hàng chờ
            processQueue();
          });
        }, nextToast.duration);
      });
    }
  };

  const showToast = (msg: string, duration: number = 2000) => {
    // Thêm toast mới vào queue
    queue.current.push({ message: msg, duration });
    // Nếu không có toast nào đang hiển thị, xử lý queue ngay
    processQueue();
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[styles.toastContainer, { opacity }]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng trong ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 1000,
    borderColor: '#fff',
    borderWidth: 1,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});
