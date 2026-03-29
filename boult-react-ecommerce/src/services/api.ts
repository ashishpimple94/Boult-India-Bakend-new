import axios, { AxiosInstance } from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  private async retryRequest<T>(
    fn: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    if (!error.response) return true; // Network errors
    const status = error.response.status;
    return status === 408 || status === 429 || status >= 500;
  }

  async getProducts(): Promise<any[]> {
    try {
      const url = `${BACKEND_URL}/api/products`;
      console.log('🔍 API: BACKEND_URL =', BACKEND_URL);
      console.log('🔍 API: Calling', url);
      console.log('🔍 API: env.REACT_APP_BACKEND_URL =', process.env.REACT_APP_BACKEND_URL);
      
      const response = await this.retryRequest(() =>
        this.api.get('/api/products')
      );
      
      console.log('🔍 API Response status:', response.status);
      console.log('🔍 API Response FULL:', response.data);
      console.log('🔍 API Products array:', response.data.products);
      console.log('🔍 API Products length:', response.data.products?.length);
      console.log('🔍 API First product:', response.data.products?.[0]);
      
      const products = response.data.products || [];
      console.log('🔍 API: Returning', products.length, 'products');
      return products;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      console.error('❌ Error details:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<any | null> {
    try {
      const products = await this.getProducts();
      return products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  async saveOrder(order: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.retryRequest(() =>
        this.api.post('/api/save-order', order)
      );
      return {
        success: true,
        data: response.data,
        timestamp: response.data.timestamp,
      };
    } catch (error: any) {
      console.error('Failed to save order:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to save order',
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, {
        timeout: 10000,
      });
      return response.data.status?.includes('Backend is running') || false;
    } catch (error: any) {
      console.error('Backend health check failed:', error.message);
      return false;
    }
  }

  async getBanners(): Promise<any[]> {
    try {
      const response = await this.retryRequest(() =>
        this.api.get('/api/banners/active')
      );
      return response.data.banners || [];
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return [];
    }
  }

  async sendContactEmail(contactData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.retryRequest(() =>
        this.api.post('/api/contact', contactData)
      );
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to send contact email:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send message'
      };
    }
  }

  async getReviews(productId: string): Promise<any[]> {
    try {
      const response = await this.retryRequest(() =>
        this.api.get(`/api/reviews/${productId}`)
      );
      return response.data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  }

  async submitReview(reviewData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.retryRequest(() =>
        this.api.post('/api/reviews', reviewData)
      );
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to submit review'
      };
    }
  }
}

export const apiService = new ApiService();