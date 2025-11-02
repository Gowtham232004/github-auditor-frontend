// lib/api.ts
// API client for backend communication

import axios from 'axios';
import { ProfileAnalysis, DeepAnalysis } from '@/types';

// Use your Railway URL here!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Debug logging
console.log(' API Configuration:');
console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('  API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 900000, // 15 minutes for deep analysis (large repos like Linux kernel)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(API Request:  );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request Timeout:', error.message);
      throw new Error('Analysis is taking longer than expected. The server may still be processing. Please try checking the results page later.');
    } else if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.detail || error.response.data.error || 'API request failed');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error - Full details:', error);
      console.error('Attempted URL:', API_BASE_URL);
      throw new Error(Network error. Could not connect to backend at . Please check your connection.);
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
);

export const githubAPI = {
  // Basic profile analysis
  analyzeProfile: async (username: string): Promise<ProfileAnalysis> => {
    const response = await api.get(/analyze/);
    return response.data;
  },

  // Deep analysis with repository commits
  analyzeDeep: async (username: string, maxRepos: number = 3): Promise<DeepAnalysis> => {
    const response = await api.get(/analyze-all/, {
      params: { max_repos: maxRepos },
    });
    return response.data;
  },

  // Get stored profile
  getProfile: async (username: string) => {
    const response = await api.get(/profile/);
    return response.data;
  },

  // Get repository analyses
  getRepoAnalyses: async (username: string) => {
    const response = await api.get(/repo-analyses/);
    return response.data;
  },

  // Get analysis history
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Detailed health
  detailedHealth: async () => {
    const response = await api.get('/health/detailed');
    return response.data;
  },
};

export default api;
