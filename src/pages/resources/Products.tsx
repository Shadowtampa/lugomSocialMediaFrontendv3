import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/product';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProductDialogs } from '@/components/dialogs/ProductDialogs';
import { CreateProductDialog } from '@/components/dialogs/CreateProductDialog';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.list();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Produtos</h2>
        <CreateProductDialog onSuccess={loadProducts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full">
            {product.image && (
              <div className="aspect-video relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader className="flex-none">
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description || 'Sem descrição'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    R$ {(Number(product.price?.price ?? 0) / 100).toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      product.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {product.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-none pt-0">
              <div className="flex justify-between gap-2 w-full">
                <ProductDialogs
                  product={product}
                  onDelete={handleDelete}
                  onUpdate={loadProducts}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 