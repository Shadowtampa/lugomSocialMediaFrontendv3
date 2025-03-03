import { useEffect, useState } from 'react';
import { promotionService, Promotion } from '@/services/promotion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await promotionService.list();
      setPromotions(data);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Promoções</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <CardTitle>{promotion.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {promotion.description || 'Sem descrição'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {promotion.type === 'percentage_discount'
                      ? `${promotion.value}%`
                      : `R$ {(Number(promotion.value ?? 0)).toFixed(2)}`}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      promotion.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promotion.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    Início: {new Date(promotion.start_date).toLocaleDateString()}
                  </p>
                  {promotion.end_date && (
                    <p>
                      Fim: {new Date(promotion.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 