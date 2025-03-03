import api from '@/lib/axios';

export interface Promotion {
  id: number;
  name: string;
  description: string | null;
  type: 'fixed_discount' | 'percentage_discount' | 'buy_x_get_y';
  value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionData {
  name: string;
  description?: string;
  type: 'fixed_discount' | 'percentage_discount' | 'buy_x_get_y';
  value: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface UpdatePromotionData extends Partial<CreatePromotionData> {}

export const promotionService = {
  async list(): Promise<Promotion[]> {
    const response = await api.get<Promotion[]>('/promotion');
    return response.data;
  },

  async get(id: number): Promise<Promotion> {
    const response = await api.get<Promotion>(`/promotion/${id}`);
    return response.data;
  },

  async create(data: CreatePromotionData): Promise<Promotion> {
    const response = await api.post<Promotion>('/promotion', data);
    return response.data;
  },

  async update(id: number, data: UpdatePromotionData): Promise<Promotion> {
    const response = await api.put<Promotion>(`/promotion/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/promotion/${id}`);
  },
}; 