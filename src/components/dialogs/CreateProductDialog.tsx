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
import { Plus } from "lucide-react";
import { CreateProductData, productService } from "../../services/product";
import { ProductForm } from "../forms/ProductForm";
import { toast } from "sonner";

interface CreateProductDialogProps {
  onSuccess: () => void;
}

export function CreateProductDialog({ onSuccess }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      await productService.create(formData);
      toast.success("Produto criado com sucesso!");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Erro ao criar produto");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo produto.
          </DialogDescription>
        </DialogHeader>
        <ProductForm onSubmit={handleSubmit} submitLabel="Criar produto" />
      </DialogContent>
    </Dialog>
  );
} 