import { useEffect, useState } from 'react';
import { promotionService, Promotion } from '@/services/promotion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreatePromotionDialog } from '@/components/dialogs/CreatePromotionDialog';
import { PromotionDialogs } from '@/components/dialogs/PromotionDialogs';
import { toast } from 'sonner';

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

  const handleDelete = async (id: number) => {
    try {
      await promotionService.delete(id);
      setPromotions(promotions.filter(promotion => promotion.id !== id));
      toast.success("Promoção excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir promoção");
      console.error('Erro ao excluir promoção:', error);
    }
  };

  const formatValue = (promotion: Promotion) => {
    const config = JSON.parse(promotion.config);
    
    switch (promotion.promotion_type_id) {
      case 2: // fixed_discount
        return `R$ ${config.discount_amount.toFixed(2)} OFF`;
      case 3: // percentage_discount
        return `${config.discount_percentage}% OFF`;
      case 4: // buy_x_get_y
        return `Compre ${config.x_product_amount} Leve ${config.y_product_amount}`;
      default:
        return '';
    }
  };

  const isActive = (promotion: Promotion) => {
    const now = new Date().toISOString().split('T')[0];
    const startDate = new Date(promotion.start_date).toISOString().split('T')[0];
    const endDate = new Date(promotion.end_date).toISOString().split('T')[0];

    return startDate <= now && now <= endDate;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Promoções</h2>
        <CreatePromotionDialog />
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
                    {formatValue(promotion)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      isActive(promotion)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isActive(promotion) ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    Início: {new Date(promotion.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    Fim: {new Date(promotion.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between gap-2 w-full">
                <PromotionDialogs
                  promotion={promotion}
                  onDelete={handleDelete}
                  onUpdate={loadPromotions}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 