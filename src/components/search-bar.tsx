import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({ value, onChange, className, placeholder = "Buscar no catálogo" }: { value?: string; onChange?: (value: string) => void; className?: string; placeholder?: string }) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">Buscar produtos</span>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="h-11 bg-card pl-11 shadow-none" />
    </label>
  );
}
