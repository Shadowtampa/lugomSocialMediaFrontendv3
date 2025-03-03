import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/services/product";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export function ProductForm({ initialData, onSubmit, submitLabel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    condition: initialData?.condition || "new",
    available: initialData?.available ?? true,
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // Adiciona os campos ao FormData
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("condition", formData.condition);
      data.append("available", formData.available ? "1" : "0");
      
      // Adiciona a imagem apenas se existir e não for edição
      if (formData.image && !initialData?.id) {
        data.append("image", formData.image);
      }

      // Se for edição, adiciona o method spoofing
      if (initialData?.id) {
        data.append("_method", "PUT");
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condição</Label>
        <select
          id="condition"
          value={formData.condition}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="new">Novo</option>
          <option value="used">Usado</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, available: checked }))}
        />
        <Label htmlFor="available">Disponível</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagem</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={!!initialData?.id}
        />
        {initialData?.id && (
          <p className="text-sm text-muted-foreground">
            A edição de imagem está disponível em breve!
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
} 