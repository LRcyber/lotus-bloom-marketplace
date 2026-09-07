import { Badge } from "@/components/ui/badge";

export function StatusBadge({ stock }: { stock: number }) {
  return stock > 0 ? (
    <Badge className="bg-success-soft text-success hover:bg-success-soft">Em estoque</Badge>
  ) : (
    <Badge variant="secondary">Indisponível</Badge>
  );
}
