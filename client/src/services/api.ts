import axios from 'axios';

const API_BASE_URL = 'https://mybankfeesapi.vercel.app/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Server Error Response:', error.response.data);
      throw new Error(`Server Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error - No response received:', error.request);
      throw new Error('Network Error: Unable to connect to server. Make sure the server is running on http://localhost:3000');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ApiBank {
  id: string;
  bank_name: string;
  bank_type: string;
  established_year?: number;
  headquarters?: string;
  website?: string;
  total_branches?: number;
  total_atms?: number;
  account_types: Array<{
    id?: number;
    type: string;
    minimumBalance: number;
    accountMaintenanceFee: number;
    atmFeeOwn: number;
    atmFeeOther: number;
    onlineBankingFee: number;
    smsBankingFee: number;
    debitCardFee: number;
    creditCardFee: number;
    nspbFee: number;
    rtgsFee: number;
    beftnFee: number;
    checkbookFee: number;
    statementFee: number;
    otherCharges: number;
    interestRate?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

interface AddBankRequest {
  id: string;
  bankName: string;
  bankType: string;
  establishedYear?: number;
  headquarters?: string;
  website?: string;
  totalBranches?: number;
  totalAtms?: number;
  accountTypes: Array<{
    type: string;
    minimumBalance: number;
    accountMaintenanceFee: number;
    atmFeeOwn: number;
    atmFeeOther: number;
    onlineBankingFee: number;
    smsBankingFee: number;
    debitCardFee: number;
    creditCardFee: number;
    nspbFee: number;
    rtgsFee: number;
    beftnFee: number;
    checkbookFee: number;
    statementFee: number;
    otherCharges: number;
    interestRate?: number;
  }>;
}

export const bankService = {
  // Get all banks
  async getAllBanks(): Promise<ApiBank[]> {
    try {
      const response = await apiClient.get('/api/banks');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching banks:', error);
      throw error;
    }
  },

  // Get bank by ID
  async getBankById(id: string): Promise<ApiBank> {
    try {
      const response = await apiClient.get(`/api/banks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bank:', error);
      throw error;
    }
  },

  // Add new bank
  async addBank(bankData: AddBankRequest): Promise<ApiResponse<{ id: string; bankName: string }>> {
    try {
      const response = await apiClient.post('/api/banks', bankData);
      return response.data;
    } catch (error) {
      console.error('Error adding bank:', error);
      throw error;
    }
  },
};
