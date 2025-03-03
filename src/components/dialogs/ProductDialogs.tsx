import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/services/product";
import { Pencil, Trash2, Megaphone } from "lucide-react";
import { ProductForm } from "@/components/forms/ProductForm";
import { productService } from "@/services/product";
import { toast } from "sonner";

interface ProductDialogsProps {
  product: Product;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export function ProductDialogs({ product, onDelete, onUpdate }: ProductDialogsProps) {
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = async (formData: FormData) => {
    try {
      await productService.update(product.id, formData);
      toast.success("Produto atualizado com sucesso!");
      setEditOpen(false);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar produto");
      console.error(error);
    }
  };

  return (
    <>
      {/* Diálogo de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Pencil className="w-4 h-4 mr-2 text-blue-500" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no produto.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initialData={product}
            onSubmit={handleEdit}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            Excluir
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{product.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => onDelete(product.id)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Anúncio */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Megaphone className="w-4 h-4 mr-2 text-purple-500" />
            Anunciar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anunciar Produto</DialogTitle>
            <DialogDescription>
              Em breve você poderá criar anúncios para seus produtos!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled>Em breve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 