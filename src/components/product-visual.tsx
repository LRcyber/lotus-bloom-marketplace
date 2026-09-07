import { Box, PackageCheck, PackageOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Box, PackageCheck, PackageOpen, Sparkles];

export function ProductVisual({ name, index = 0, className }: { name: string; index?: number; className?: string }) {
  const Icon = icons[index % icons.length];
  return (
    <div role="img" aria-label={`Imagem não disponível para ${name}`} className={cn("grid aspect-square place-items-center bg-secondary", className)}>
      <div className="grid size-20 place-items-center rounded-full border border-border bg-background text-primary">
        <Icon className="size-8" strokeWidth={1.4} />
      </div>
    </div>
  );
}
