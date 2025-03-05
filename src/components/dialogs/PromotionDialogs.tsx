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
import { Pencil, Trash2, Megaphone } from "lucide-react";
import { Promotion, promotionService } from "@/services/promotion";
import { toast } from "sonner";
import { PromotionForm } from "@/components/forms/PromotionForm";

interface PromotionDialogsProps {
  promotion: Promotion;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export function PromotionDialogs({ promotion, onDelete, onUpdate }: PromotionDialogsProps) {
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData);
      await promotionService.update(promotion.id, data);
      toast.success("Promoção atualizada com sucesso!");
      setEditOpen(false);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar promoção");
      console.error("Erro ao atualizar promoção:", error);
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
            <DialogTitle>Editar Promoção</DialogTitle>
            <DialogDescription>
              Atualize os dados da promoção nos campos abaixo.
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            initialData={promotion}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
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
            <DialogTitle>Excluir Promoção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a promoção "{promotion.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => onDelete(promotion.id)}
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
            <DialogTitle>Anunciar Promoção</DialogTitle>
            <DialogDescription>
              Em breve você poderá criar anúncios para suas promoções!
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