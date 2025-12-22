import axios from 'axios';

const httpClient = axios.create({
  baseURL: "http://localhost:5124",
});

httpClient.interceptors.request.use((config) => {
    const stored = localStorage.getItem('auth');
    console.log("🔥 Axios interceptor fired", config.url);

    if (stored) {
      const { token, user } = JSON.parse(stored);
      console.log("🔥 Stored auth:", stored);

  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔥 Token attached");
      }
  
      if (user?.tenantId) {
        config.headers['X-Tenant-Id'] = user.tenantId;
        console.log("🔥 Tenant attached");
      }
    }
  
    return config;
  });

export default httpClient;
