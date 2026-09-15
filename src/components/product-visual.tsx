import { Box, PackageCheck, PackageOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Box, PackageCheck, PackageOpen, Sparkles];

export function ProductVisual({ name, imageUrl, index = 0, className }: { name: string; imageUrl?: string | null; index?: number; className?: string }) {
  const Icon = icons[index % icons.length] ?? Box;
  if (imageUrl) return <img src={imageUrl} alt={name} loading="lazy" className={cn("aspect-square w-full object-cover", className)} />;
  return (
    <div role="img" aria-label={`Imagem não disponível para ${name}`} className={cn("grid aspect-square place-items-center bg-secondary", className)}>
      <div className="grid size-20 place-items-center rounded-full border border-border bg-background text-primary">
        <Icon className="size-8" strokeWidth={1.4} />
      </div>
    </div>
  );
}
