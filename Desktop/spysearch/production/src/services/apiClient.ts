
import { API_CONFIG } from '@/config/api';

class ApiClient {
  private baseURL = API_CONFIG.BASE_URL;
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    console.log('ApiClient: Token updated:', !!token);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      ...API_CONFIG.DEFAULT_HEADERS,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private getHeadersWithAuth(): HeadersInit {
    const token = this.token || localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      ...API_CONFIG.DEFAULT_HEADERS,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getHeadersWithAuth(),
        ...options.headers,
      },
      credentials: 'include', // Include credentials for CORS
    };

    console.log('ApiClient: Making request to:', url, 'with options:', requestOptions);

    try {
      const response = await fetch(url, requestOptions);
      console.log('ApiClient: Response status:', response.status);
      return response;
    } catch (error) {
      console.error('ApiClient: Request failed:', error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint: string, data?: any): Promise<any> {
    const response = await this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async postFormData(endpoint: string, formData: FormData): Promise<any> {
    const token = this.token || localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getTokenStatus(): Promise<any> {
    return this.get('/api/tokens/status');
  }
}

export const apiClient = new ApiClient();
