
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EXPO_PUBLIC_API_SERVER_HOST, EXPO_PUBLIC_API_SERVER_PORT } from '@env'
import { openRoutes } from "@/constants/ApiEndPoint";

// const API_SERVER_HOST = '192.168.191.165'
// const API_SERVER_PORT = '8082'

const API_SERVER_URL = `http://${EXPO_PUBLIC_API_SERVER_HOST}:${EXPO_PUBLIC_API_SERVER_PORT}/api/v1`;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}


async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
  reqOptions: restApiOptions = {}
): Promise<ApiResponse<T>> {

  console.log(`${API_SERVER_URL}${endpoint}`)

  const token = await AsyncStorage.getItem("token");

  let headers: HeadersInit = reqOptions?.headers || {
    "Content-Type": "application/json",
  };

  const isOpenRoutes = Object.values(openRoutes).some(route => endpoint.startsWith(route));


  if (!isOpenRoutes && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }


  const options: RequestInit = {
    method,
    headers,
    body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined,
  };


  try {
    const response = await fetch(`${API_SERVER_URL}${endpoint}`, options);

    // Nếu token hết hạn, thử refresh
    if (response.status === 401 && !isOpenRoutes) {
      const newToken = await refreshToken();
      if (newToken) {
        return request<T>(endpoint, method, body, reqOptions); // Thử lại với token mới
      }
    }

    const data = await response.json();
    return { success: response.ok, data, message: data?.message };
  } catch (error) {
    console.error("API Request Error:", error);
    return { success: false, message: "Lỗi kết nối đến server." };
  }
}

// Hàm tự động refresh token nếu token cũ hết hạn
async function refreshToken(): Promise<string | null> {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_SERVER_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (res.ok && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error("Lỗi refresh token:", error);
  }

  return null;
}

// Các hàm API cụ thể
export const api = {
  get: <T>(endpoint: string, options?: restApiOptions) => request<T>(endpoint, "GET", undefined, options),
  post: <T>(endpoint: string, body: any, options?: restApiOptions) => request<T>(endpoint, "POST", body, options),
  put: <T>(endpoint: string, body: any, options?: restApiOptions) => request<T>(endpoint, "PUT", body, options),
  delete: <T>(endpoint: string, options?: restApiOptions) => request<T>(endpoint, "DELETE", undefined, options),
};

export type restApiOptions = {
  headers?: {
    [key: string]: string;
  }
}