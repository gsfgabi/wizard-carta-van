/// <reference types="vite/client" />
import axios from 'axios';
import type { Bank, FormData as FormDataType, Product, ZendeskTicket } from '../types';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5174/api' 
  : 'https://wizard-carta-van-teste.onrender.com';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000 // Reduzindo para 15 segundos
});

// Função para retry
const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      baseURL: response.config.baseURL,
      fullURL: `${response.config.baseURL}${response.config.url}`
    });
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown'
      });
      return Promise.reject(new Error('A requisição demorou muito tempo para responder. Por favor, tente novamente.'));
    }

    console.error('Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      message: error.message
    });
    return Promise.reject(error);
  }
);

export interface BankData {
  id: number;
  code: string;
  name: string;
}

export interface ProductData {
  id: number;
  name: string;
  available: boolean;
}

export interface CNABData {
  id: number;
  code: string;
  name: string;
  available: boolean;
}

export interface VanTypeData {
  id: number;
  type: string;
  available: boolean;
}

export interface AuthorizationLetterData {
  company: {
    corporate_name: string;
    cnpj: string;
  };
  bank: {
    id: number;
    bank_name: string;
    branch_number: string;
    account_number: string;
    agreement_number: string;
  };
  responsible_person: {
    responsible_person_name: string;
    responsible_person_email: string;
    responsible_person_cellphone: string;
  };
  manager: {
    manager_name: string;
    manager_email: string;
    manager_cellphone: string;
  };
  id_products: { id: number }[];
  id_van_types: { id: number }[];
  id_cnabs: { id: number }[];
}

export const getBanks = async (): Promise<BankData[]> => {
  try {
    return await retryRequest(async () => {
      const response = await api.get('/banks');
      console.log('Resposta da API:', response.data);
      const banks = response.data.map((b: any) => ({
        id: b.id,
        code: b.code,
        name: b.name
      }));
      banks.sort((a, b) => a.code.localeCompare(b.code));
      return banks;
    });
  } catch (error) {
    console.error('Erro ao buscar bancos:', error);
    throw error;
  }
};

export const getProducts = async (bankId: string): Promise<ProductData[]> => {
  try {
    return await retryRequest(async () => {
      const response = await api.get(`/products/${bankId}`);
      return response.data;
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const getCNABs = async (bankId: string): Promise<CNABData[]> => {
  try {
    return await retryRequest(async () => {
      const response = await api.get(`/cnabs/${bankId}`);
      console.log('Resposta da API CNABs:', response.data);
      return response.data.map((cnab: any) => ({
        id: cnab.id,
        code: cnab.name,
        name: cnab.name,
        available: cnab.available
      }));
    });
  } catch (error) {
    console.error('Erro ao buscar CNABs:', error);
    throw error;
  }
};

export const getVanTypes = async (bankId: string): Promise<VanTypeData[]> => {
  try {
    return await retryRequest(async () => {
      const response = await api.get(`/van-types/${bankId}`);
      return response.data;
    });
  } catch (error) {
    console.error('Erro ao buscar tipos de VAN:', error);
    throw error;
  }
};

export const generatePDF = async (
  formData: FormDataType,
  product: Product
): Promise<Blob> => {
  const response = await api.post(
    '/generate-pdf',
    { formData, product },
    { responseType: 'blob' }
  );
  return response.data;
};

export const createZendeskTicket = async (
  formData: FormDataType,
  product: Product,
  pdfBlob: Blob
): Promise<ZendeskTicket> => {
  const formDataToSend = new FormData();
  formDataToSend.append('formData', JSON.stringify(formData));
  formDataToSend.append('product', product);
  formDataToSend.append('pdf', pdfBlob);

  const response = await api.post('/zendesk/ticket', formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const sendEmail = async (
  formData: FormDataType,
  product: Product,
  pdfBlob: Blob,
  ticketUrl: string
): Promise<void> => {
  const formDataToSend = new FormData();
  formDataToSend.append('formData', JSON.stringify(formData));
  formDataToSend.append('product', product);
  formDataToSend.append('pdf', pdfBlob);
  formDataToSend.append('ticketUrl', ticketUrl);

  await api.post('/email/send', formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createAuthorizationLetter = async (data: AuthorizationLetterData): Promise<any> => {
  try {
    return await retryRequest(async () => {
      const response = await api.post('/auth/authorization-letters', data);
      return response.data;
    });
  } catch (error) {
    console.error('Erro ao criar carta de autorização:', error);
    throw error;
  }
}; 