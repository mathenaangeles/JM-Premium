import axios from 'axios';

const Axios = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
  
Axios.interceptors.request.use((config) => {
    const csrfToken = getCookie('csrf_access_token');
    if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
});

  
export default Axios;