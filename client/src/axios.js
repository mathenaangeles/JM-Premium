import axios from 'axios';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

Axios.interceptors.request.use((config) => {
  if (!config.url.includes("/users/refresh")) {
    const csrfToken = getCookie('csrf_access_token');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
  }
  return config;
});

Axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const csrfRefresh = getCookie("csrf_refresh_token");
        await Axios.post("/users/refresh", {}, {
          headers: csrfRefresh ? { "X-CSRF-TOKEN": csrfRefresh } : {},
        });
        return Axios(original);
      } catch (e) {
        store.dispatch(clearAuth());
        persistor.purge();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default Axios;
