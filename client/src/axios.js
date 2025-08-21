import axios from 'axios';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

const getCookie = (name) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
};

Axios.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrf_access_token');
  if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export default Axios;