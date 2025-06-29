import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://99f2-2402-d000-8114-594c-7976-f4e3-e548-ff5e.ngrok-free.app'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface BillCalculationData {
  accountNo: number;
  presentReading: number;
  previousReading: number;
  additionalcharge: number;
  othercharges: number;
}

export const loginUser = (credentials: LoginCredentials) => {
  return api.post('/auth/login', credentials);
};

export const registerUser = (userData: RegisterData) => {
  return api.post('/auth/register', userData);
};

export const getCustomerByAccount = (accountNo: string) => {
  return api.get(`/api/invoice/getcustomer/${accountNo}`);
};

export const calculateBill = (billData: BillCalculationData) => {
  return api.post('/api/invoice/calculate', billData);
};

export const generateInvoice = (invoiceData: BillCalculationData) => {
  return api.post('/api/invoice/generate', invoiceData);
};

export default api;
