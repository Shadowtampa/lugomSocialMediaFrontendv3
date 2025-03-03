import api from '@/lib/axios';

interface Price {
  id: number;
  created_at: string;
  updated_at: string;
  product_id: number;
  price: string;
  start_date: string;
  end_date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  condition: string;
  available: boolean;
  image: string;
  user_id: number;
  price: Price;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  condition: 'new' | 'used';
  available: boolean;
  image?: File;
  price: number;
  currency: string;
  start_date: string;
  end_date?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productService = {
  async list(): Promise<Product[]> {
    const response = await api.get<Product[]>('/product');
    return response.data;
  },

  async get(id: number): Promise<Product> {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  async create(data: CreateProductData): Promise<Product> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.post<Product>('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: number, data: UpdateProductData): Promise<Product> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await api.put<Product>(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product/${id}`);
  },
}; 