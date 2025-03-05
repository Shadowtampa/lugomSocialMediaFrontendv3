import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { PromotionForm } from '@/components/forms/PromotionForm';
import { promotionService } from '@/services/promotion';
import { toast } from 'sonner';

export function CreatePromotionDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData);
      await promotionService.create(data);
      setOpen(false);
      toast.success('Promoção criada com sucesso!');
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao criar promoção');
      console.error('Erro ao criar promoção:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Promoção
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Promoção</DialogTitle>
          <DialogDescription>
            Crie uma nova promoção preenchendo os campos abaixo.
          </DialogDescription>
        </DialogHeader>
        <PromotionForm onSubmit={handleSubmit} submitLabel="Criar Promoção" />
      </DialogContent>
    </Dialog>
  );
} 