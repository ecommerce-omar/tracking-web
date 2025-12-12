import axios from 'axios';
import { createClient } from '@/utils/supabase/client';

// Configurar axios para usar o Supabase REST API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const api = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey!,
    'Authorization': `Bearer ${supabaseKey!}`,
  },
});

// Request interceptor para adicionar token de sessão
api.interceptors.request.use(
  async (config) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.warn('Error getting session:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;