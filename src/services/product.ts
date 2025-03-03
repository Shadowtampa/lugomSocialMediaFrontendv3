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
  description: string;
  condition: "new" | "used";
  available: boolean;
  image?: File;
}

export interface UpdateProductData extends CreateProductData {
  _method?: string;
}

export const productService = {
  async list(): Promise<Product[]> {
    const response = await api.get<Product[]>('/product');
    return response.data;
  },

  async get(id: number): Promise<Product> {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  async create(data: FormData): Promise<Product> {
    const response = await api.post<Product>('/product', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: number, data: FormData): Promise<Product> {
    const response = await api.post<Product>(`/product/${id}`, data, {
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