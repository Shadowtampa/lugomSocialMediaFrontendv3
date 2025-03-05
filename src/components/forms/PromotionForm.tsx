import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Promotion } from '@/services/promotion';
import { productService } from '@/services/product';

interface PromotionFormProps {
  initialData?: Promotion;
  onSubmit: (formData: FormData) => void;
  submitLabel?: string;
}

export function PromotionForm({ initialData, onSubmit, submitLabel = 'Salvar' }: PromotionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 10) : '');
  const [endDate, setEndDate] = useState(initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '');
  const [promotionType, setPromotionType] = useState(initialData?.promotion_type_id?.toString() || '');
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [productId, setProductId] = useState('');
  const [xProductId, setXProductId] = useState('');
  const [xProductAmount, setXProductAmount] = useState('');
  const [yProductId, setYProductId] = useState('');
  const [yProductAmount, setYProductAmount] = useState('');
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await productService.list();
        setProducts(productList);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData?.config) {
      const config = JSON.parse(initialData.config);
      console.log('Configuração inicial:', config);

      setDiscountAmount(config.discount_amount?.toString() || '');
      setDiscountPercentage(config.discount_percentage?.toString() || '');
      setProductId(config.product_id?.toString() || '');
      setXProductId(config.x_product_id?.toString() || '');
      setXProductAmount(config.x_product_amount?.toString() || '');
      setYProductId(config.y_product_id?.toString() || '');
      setYProductAmount(config.y_product_amount?.toString() || '');
    }
  }, [initialData]);

  useEffect(() => {
    console.log(productId)
  }, [productId])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('start_date', startDate);
    if (endDate) formData.append('end_date', endDate);
    formData.append('promotion_type_id', promotionType);

    let config = {};
    switch (promotionType) {
      case '2': // fixed_discount
        config = { discount_amount: parseFloat(discountAmount), product_id: parseInt(productId) };
        break;
      case '3': // percentage_discount
        config = { discount_percentage: parseFloat(discountPercentage), product_id: parseInt(productId) };
        break;
      case '4': // buy_x_get_y
        config = { 
          x_product_id: parseInt(xProductId),
          x_product_amount: parseInt(xProductAmount),
          y_product_id: parseInt(yProductId),
          y_product_amount: parseInt(yProductAmount),
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Fim</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="promotionType">Tipo de Promoção</Label>
        <Select value={promotionType} onValueChange={setPromotionType}>
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

      {promotionType === '2' && (
        <div className="space-y-2">
          <Label htmlFor="discountAmount">Valor do Desconto (R$)</Label>
          <Input
            id="discountAmount"
            type="number"
            step="0.01"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            required
          />
          <Label htmlFor="productId">ID do Produto</Label>
          <Select value={productId} onValueChange={setProductId}>
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


      {promotionType === '3' && (
        
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Percentual de Desconto (%)</Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
          />
          <Label htmlFor="productId">ID do Produto</Label>
          <Select value={productId} onValueChange={() => console.log("MUDEI PORQUE SOU VIADO")}>
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

      {promotionType === '4' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xProductId">ID do Produto X</Label>
            <Select value={xProductId} onValueChange={setXProductId}>
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
              value={xProductAmount}
              onChange={(e) => setXProductAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yProductId">ID do Produto Y</Label>
            <Select value={yProductId} onValueChange={setYProductId}>
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
              value={yProductAmount}
              onChange={(e) => setYProductAmount(e.target.value)}
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