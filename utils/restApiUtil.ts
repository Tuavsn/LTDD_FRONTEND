import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
// require("dotenv").config();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL || "https://fallback.com";
console.log(Constants.expoConfig?.extra);


async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
  reqOptions: restApiOptions = { requiresAuth: false }
): Promise<ApiResponse<T>> {
  const token = await AsyncStorage.getItem("token");

  let headers: HeadersInit = reqOptions.headers || {
    "Content-Type": "application/json",
  };

  console.log(headers)

  if (reqOptions.requiresAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }


  const options: RequestInit = {
    method,
    headers,
    body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined,
  };


  try {
    console.log('fetching')
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Nếu token hết hạn, thử refresh
    if (response.status === 401 && reqOptions.requiresAuth) {
      console.log('no permission')
      const newToken = await refreshToken();
      if (newToken) {
        return request<T>(endpoint, method, body, reqOptions); // Thử lại với token mới
      }
    }

    console.log(response)
    const data = await response.json();
    console.log('tes2')
    console.log("API Response:", response.status, data);
    return { success: response.ok, data, message: data?.message };
  } catch (error) {
    console.error("API Request Error:", error);
    return { success: false, message: "Lỗi kết nối đến server." };
  }
}

// Hàm tự động refresh token nếu token cũ hết hạn
async function refreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
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
  get: <T>(endpoint: string, options: restApiOptions = { requiresAuth: false }) => request<T>(endpoint, "GET", undefined, options),
  post: <T>(endpoint: string, body: any, options: restApiOptions = { requiresAuth: false }) => request<T>(endpoint, "POST", body, options),
  put: <T>(endpoint: string, body: any, options: restApiOptions = { requiresAuth: false }) => request<T>(endpoint, "PUT", body, options),
  delete: <T>(endpoint: string, options: restApiOptions = { requiresAuth: false }) => request<T>(endpoint, "DELETE", undefined, options),
};

export type restApiOptions = {
  requiresAuth: boolean;
  headers?: {
    [key: string]: string;
  }
}