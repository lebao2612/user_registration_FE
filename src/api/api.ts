import axios, { AxiosError } from 'axios';

// ĐẶT URL BACKEND CỦA BẠN Ở ĐÂY
const API_URL = 'https://user-registration-api-dl92.onrender.com';
// const API_URL = 'http://localhost:3000'; // Nếu chạy BE ở local

const api = axios.create({
  baseURL: API_URL,
});

/**
 * accessToken được lưu "in-memory".
 * Nó sẽ bị mất khi refresh trang, và đó là điều mong muốn.
 * Chúng ta sẽ dùng refreshToken để lấy lại nó khi app tải.
 */
let accessToken: string | null = null;

export const setMemoryAccessToken = (token: string | null) => {
  accessToken = token;
};

// Request interceptor: Tự động thêm Access Token vào header
api.interceptors.request.use(
  (config) => {
    // Bỏ qua auth header cho các đường dẫn đăng ký/đăng nhập
    if (config.url?.includes('/auth/login') || config.url?.includes('/user/register')) {
      return config;
    }
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Xử lý tự động refresh token
api.interceptors.response.use(
  (response) => response, // Trả về response nếu không có lỗi
  async (error: AxiosError) => {
    const originalRequest = error.config as any; // Thêm 'any' để truy cập _retry

    // Lỗi 401 VÀ request này chưa được thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu là đã thử lại

      const refreshToken = localStorage.getItem('refreshToken');

      // Nếu request bị 401 là do refresh token (hoặc không có refresh token) -> Đăng xuất
      if (originalRequest.url?.includes('/auth/refresh') || !refreshToken) {
        console.error('Refresh token failed or not available. Logging out.');
        localStorage.removeItem('refreshToken');
        setMemoryAccessToken(null);
        // Dùng window.location để đảm bảo app được tải lại và context được reset
        window.location.href = '/login'; 
        return Promise.reject(error);
      }

      try {
        console.log('Access token expired. Refreshing token...');
        // Gọi API refresh token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {}, // body rỗng
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        // Lấy token mới
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Cập nhật token
        localStorage.setItem('refreshToken', newRefreshToken);
        setMemoryAccessToken(newAccessToken);

        // Cập nhật header của request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Thử lại request gốc với token mới
        return api(originalRequest);
      } catch (refreshError) {
        // Xử lý nếu refresh token thất bại
        console.error('Error refreshing token:', refreshError);
        localStorage.removeItem('refreshToken');
        setMemoryAccessToken(null);
        window.location.href = '/login'; // Chuyển hướng cứng
        return Promise.reject(refreshError);
      }
    }

    // Trả về các lỗi khác (không phải 401)
    return Promise.reject(error);
  },
);

export default api;
