import axios from 'axios';

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});
  
export default Axios;