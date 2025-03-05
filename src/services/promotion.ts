import api from '@/lib/axios';

interface PromotionConfig {
  discount_amount?: number;
  min_purchase_amount?: number;
  discount_percentage?: number;
  product_id?: number;
  x_product_id?: number;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  user_id: number;
  config: string;
  promotion_type_id: number; // 2: fixed, 3: percentage, 4: buy_x_get_y
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionData {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  config: PromotionConfig;
  promotion_type_id: number;
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