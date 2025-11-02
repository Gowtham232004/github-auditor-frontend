// lib/api.ts// lib/api.ts

// API client for backend communication// API client for backend communication



import axios from 'axios';import axios from 'axios';

import { ProfileAnalysis, DeepAnalysis } from '@/types';import { ProfileAnalysis, DeepAnalysis } from '@/types';



// Use your Railway URL here!// Use your Railway URL here!

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log(' API Configuration:');

// Debug loggingconsole.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

console.log('🔧 API Configuration:');console.log('  API_BASE_URL:', API_BASE_URL);

console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

console.log('  API_BASE_URL:', API_BASE_URL);const api = axios.create({

  baseURL: API_BASE_URL,

const api = axios.create({  timeout: 900000, // 15 minutes for deep analysis (large repos like Linux kernel)

  baseURL: API_BASE_URL,  headers: {

  timeout: 900000, // 15 minutes for deep analysis (large repos like Linux kernel)    'Content-Type': 'application/json',

  headers: {  },

    'Content-Type': 'application/json',});

  },

});// Add request interceptor for logging

api.interceptors.request.use(

// Add request interceptor for logging  (config) => {

api.interceptors.request.use(    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

  (config) => {    return config;

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);  },

    return config;  (error) => {

  },    return Promise.reject(error);

  (error) => {  }

    return Promise.reject(error););

  }

);// Add response interceptor for error handling

api.interceptors.response.use(

// Add response interceptor for error handling  (response) => response,

api.interceptors.response.use(  (error) => {

  (response) => response,    if (error.code === 'ECONNABORTED') {

  (error) => {      // Request timeout

    if (error.code === 'ECONNABORTED') {      console.error('Request Timeout:', error.message);

      // Request timeout      throw new Error('Analysis is taking longer than expected. The server may still be processing. Please try checking the results page later.');

      console.error('Request Timeout:', error.message);    } else if (error.response) {

      throw new Error('Analysis is taking longer than expected. The server may still be processing. Please try checking the results page later.');      // Server responded with error

    } else if (error.response) {      console.error('API Error:', error.response.data);

      // Server responded with error      throw new Error(error.response.data.detail || error.response.data.error || 'API request failed');

      console.error('API Error:', error.response.data);    } else if (error.request) {

      throw new Error(error.response.data.detail || error.response.data.error || 'API request failed');      // Request made but no response

    } else if (error.request) {      console.error('Network Error:', error.request);

      // Request made but no response      throw new Error(Network error. Could not connect to backend at ${API_BASE_URL}. Please check your connection.);

      console.error('Network Error - Full details:', error);    } else {

      console.error('Attempted URL:', API_BASE_URL);      // Something else happened

      throw new Error(`Network error. Could not connect to backend at ${API_BASE_URL}. Please check your connection.`);      console.error('Error:', error.message);

    } else {      throw new Error(error.message);

      // Something else happened    }

      console.error('Error:', error.message);  }

      throw new Error(error.message););

    }

  }export const githubAPI = {

);  // Basic profile analysis

  analyzeProfile: async (username: string): Promise<ProfileAnalysis> => {

export const githubAPI = {    const response = await api.get(`/analyze/${username}`);

  // Basic profile analysis    return response.data;

  analyzeProfile: async (username: string): Promise<ProfileAnalysis> => {  },

    const response = await api.get(`/analyze/${username}`);

    return response.data;  // Deep analysis with repository commits

  },  analyzeDeep: async (username: string, maxRepos: number = 3): Promise<DeepAnalysis> => {

    const response = await api.get(`/analyze-all/${username}`, {

  // Deep analysis with repository commits      params: { max_repos: maxRepos },

  analyzeDeep: async (username: string, maxRepos: number = 3): Promise<DeepAnalysis> => {    });

    const response = await api.get(`/analyze-all/${username}`, {    return response.data;

      params: { max_repos: maxRepos },  },

    });

    return response.data;  // Get stored profile

  },  getProfile: async (username: string) => {

    const response = await api.get(`/profile/${username}`);

  // Get stored profile    return response.data;

  getProfile: async (username: string) => {  },

    const response = await api.get(`/profile/${username}`);

    return response.data;  // Get repository analyses

  },  getRepoAnalyses: async (username: string) => {

    const response = await api.get(`/repo-analyses/${username}`);

  // Get repository analyses    return response.data;

  getRepoAnalyses: async (username: string) => {  },

    const response = await api.get(`/repo-analyses/${username}`);

    return response.data;  // Get analysis history

  },  getHistory: async () => {

    const response = await api.get('/history');

  // Get analysis history    return response.data;

  getHistory: async () => {  },

    const response = await api.get('/history');

    return response.data;  // Health check

  },  healthCheck: async () => {

    const response = await api.get('/health');

  // Health check    return response.data;

  healthCheck: async () => {  },

    const response = await api.get('/health');

    return response.data;  // Detailed health

  },  detailedHealth: async () => {

    const response = await api.get('/health/detailed');

  // Detailed health    return response.data;

  detailedHealth: async () => {  },

    const response = await api.get('/health/detailed');};

    return response.data;

  },export default api;
};

export default api;
