import { Box, PackageCheck, PackageOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Box, PackageCheck, PackageOpen, Sparkles];

function getCategoryIcon(category: string, index: number) {
  const categoryValue = [...category].reduce((total, character) => total + character.charCodeAt(0), 0);
  return icons[(categoryValue + index) % icons.length] ?? Box;
}

export function ProductVisual({ name, category = "Outros", imageUrl, index = 0, className }: { name: string; category?: string; imageUrl?: string | null; index?: number; className?: string }) {
  const Icon = getCategoryIcon(category, index);
  if (imageUrl) return <img src={imageUrl} alt={name} loading="lazy" className={cn("aspect-square w-full object-cover", className)} />;
  return (
    <div role="img" aria-label={`Imagem não disponível para ${name}`} className={cn("grid aspect-square place-items-center bg-secondary", className)}>
      <div className="grid size-20 place-items-center rounded-full border border-border bg-background text-primary">
        <Icon className="size-8" strokeWidth={1.4} />
      </div>
    </div>
  );
}
