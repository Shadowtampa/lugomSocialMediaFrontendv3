import { useReducer, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Promotion } from '@/services/promotion';
import { productService } from '@/services/product';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
}

interface PromotionFormProps {
  initialData?: Promotion;
  onSubmit: (formData: FormData) => void;
  submitLabel?: string;
}

// Estado inicial
const initialState = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  promotionType: '',
  discountAmount: '',
  discountPercentage: '',
  productId: '',
  xProductId: '',
  xProductAmount: '',
  yProductId: '',
  yProductAmount: '',
};

// Reducer para gerenciar o estado
const reducer = (state, action) => {
  return { ...state, [action.name]: action.value };
};

export function PromotionForm({ initialData, onSubmit, submitLabel = 'Salvar' }: PromotionFormProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Buscar produtos usando TanStack Query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.list,
  });

  // Inicializar estado com os dados iniciais
  useEffect(() => {
    if (initialData) {
      dispatch({ name: 'name', value: initialData.name || '' });
      dispatch({ name: 'description', value: initialData.description || '' });
      dispatch({
        name: 'startDate',
        value: initialData.start_date
          ? new Date(initialData.start_date).toISOString().slice(0, 10)
          : '',
      });
      dispatch({
        name: 'endDate',
        value: initialData.end_date
          ? new Date(initialData.end_date).toISOString().slice(0, 10)
          : '',
      });
      dispatch({
        name: 'promotionType',
        value: initialData.promotion_type_id?.toString() || '',
      });

      if (initialData.config) {
        const config = JSON.parse(initialData.config);
        Object.entries(config).forEach(([key, value]) =>
          dispatch({ name: key, value: value?.toString() || '' })
        );
      }
    }
  }, [initialData]);

  // Monitoramento do productId
  useEffect(() => {
    console.log(state.productId);
  }, [state.productId]);

  const handleProductChange = (value: string, setProduct: React.Dispatch<React.SetStateAction<string>>) => {
    console.log('Selected value:', value);
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setProduct(numericValue.toString());
    } else {
      console.warn('O valor selecionado não é um número válido:', value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', state.name);
    formData.append('description', state.description);
    formData.append('start_date', state.startDate);
    if (state.endDate) formData.append('end_date', state.endDate);
    formData.append('promotion_type_id', state.promotionType);

    let config = {};
    switch (state.promotionType) {
      case '2': // fixed_discount
        config = { discount_amount: parseFloat(state.discountAmount), product_id: parseInt(state.productId) };
        break;
      case '3': // percentage_discount
        config = { discount_percentage: parseFloat(state.discountPercentage), product_id: parseInt(state.productId) };
        break;
      case '4': // buy_x_get_y
        config = {
          x_product_id: parseInt(state.xProductId),
          x_product_amount: parseInt(state.xProductAmount),
          y_product_id: parseInt(state.yProductId),
          y_product_amount: parseInt(state.yProductAmount),
        };
        break;
    }
    formData.append('config', JSON.stringify(config));

    if (initialData?.id) {
      formData.append('_method', 'PUT');
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={state.name}
          onChange={(e) => dispatch({ name: 'name', value: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={state.description}
          onChange={(e) => dispatch({ name: 'description', value: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={state.startDate}
            onChange={(e) => dispatch({ name: 'startDate', value: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Fim</Label>
          <Input
            id="endDate"
            type="date"
            value={state.endDate}
            onChange={(e) => dispatch({ name: 'endDate', value: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="promotionType">Tipo de Promoção</Label>
        <Select value={state.promotionType} onValueChange={(value) => dispatch({ name: 'promotionType', value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Desconto Fixo</SelectItem>
            <SelectItem value="3">Desconto Percentual</SelectItem>
            <SelectItem value="4">Compre X Leve Y</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.promotionType === '2' && (
        <div className="space-y-2">
          <Label htmlFor="discountAmount">Valor do Desconto (R$)</Label>
          <Input
            id="discountAmount"
            type="number"
            step="0.01"
            value={state.discountAmount}
            onChange={(e) => dispatch({ name: 'discountAmount', value: e.target.value })}
            required
          />
          <Label htmlFor="productId">ID do Produto</Label>
          <Select value={state.productId} onValueChange={(value) => handleProductChange(value, (value) => dispatch({ name: 'productId', value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {state.promotionType === '3' && (
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Percentual de Desconto (%)</Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            value={state.discountPercentage}
            onChange={(e) => dispatch({ name: 'discountPercentage', value: e.target.value })}
            required
          />
          <Label htmlFor="productId">ID do Produto</Label>
          <Select value={state.productId} onValueChange={(value) => handleProductChange(value, (value) => dispatch({ name: 'productId', value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {state.promotionType === '4' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xProductId">ID do Produto X</Label>
            <Select value={state.xProductId} onValueChange={(value) => handleProductChange(value, (value) => dispatch({ name: 'xProductId', value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto X" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="xProductAmount">Quantidade do Produto X</Label>
            <Input
              id="xProductAmount"
              type="number"
              value={state.xProductAmount}
              onChange={(e) => dispatch({ name: 'xProductAmount', value: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yProductId">ID do Produto Y</Label>
            <Select value={state.yProductId} onValueChange={(value) => handleProductChange(value, (value) => dispatch({ name: 'yProductId', value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto Y" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="yProductAmount">Quantidade do Produto Y</Label>
            <Input
              id="yProductAmount"
              type="number"
              value={state.yProductAmount}
              onChange={(e) => dispatch({ name: 'yProductAmount', value: e.target.value })}
              required
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
} 