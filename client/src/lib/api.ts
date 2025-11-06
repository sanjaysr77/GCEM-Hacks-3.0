import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({ baseURL });

export default api;


