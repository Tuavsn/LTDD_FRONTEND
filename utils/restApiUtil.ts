import Constants from "expo-constants";
// require("dotenv").config();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL || "https://fallback.com";
console.log(Constants.expoConfig?.extra);


async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  // const token = localStorage.getItem("accessToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // if (requiresAuth && token) {
  //   headers["Authorization"] = `Bearer ${token}`;
  // }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    console.log("API Request:", method, `${API_URL}${endpoint}`, body);
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Nếu token hết hạn, thử refresh
    if (response.status === 401 && requiresAuth) {
      const newToken = await refreshToken();
      if (newToken) {
        return request<T>(endpoint, method, body, requiresAuth); // Thử lại với token mới
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
  get: <T>(endpoint: string, requiresAuth: boolean = true) => request<T>(endpoint, "GET", undefined, requiresAuth),
  post: <T>(endpoint: string, body: any, requiresAuth: boolean = true) => request<T>(endpoint, "POST", body, requiresAuth),
  put: <T>(endpoint: string, body: any, requiresAuth: boolean = true) => request<T>(endpoint, "PUT", body, requiresAuth),
  delete: <T>(endpoint: string, requiresAuth: boolean = true) => request<T>(endpoint, "DELETE", undefined, requiresAuth),
};
