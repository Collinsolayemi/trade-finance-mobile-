import { Platform } from 'react-native';

export const DEFAULT_API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/v1'
    : 'http://localhost:3000/v1';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const apiConfig: ApiConfig = {
  baseUrl: DEFAULT_API_URL,
  timeout: 15000,
};

export const setApiBaseUrl = (url: string) => {
  apiConfig.baseUrl = url.replace(/\/+$/, '');
};

