import axios from 'axios';

const httpClient = axios.create({
  baseURL: "http://localhost:5124",
});

httpClient.interceptors.request.use((config) => {
    const stored = localStorage.getItem('auth');

    if (stored) {
      const { token, user } = JSON.parse(stored);

  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      if (user?.tenantId) {
        config.headers['X-Tenant-Id'] = user.tenantId;
      }
    }
  
    return config;
  });

export default httpClient;
