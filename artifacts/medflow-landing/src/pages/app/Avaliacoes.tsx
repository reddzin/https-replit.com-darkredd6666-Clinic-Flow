import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";

export default function Avaliacoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Acompanhe a satisfação dos pacientes com os atendimentos realizados.
        </p>
        <Button variant="outline" data-testid="button-solicitar-avaliacao">
          <Plus className="w-4 h-4 mr-2" /> Solicitar Avaliação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Média Geral", value: "—", sub: "Sem avaliações ainda" },
          { label: "Total de Avaliações", value: "0", sub: "Nenhuma recebida" },
          { label: "Taxa de Resposta", value: "—", sub: "Sem dados" },
        ].map((card, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border p-6 shadow-sm text-center">
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-muted-foreground/30" />
              ))}
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">0 avaliações recebidas</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nenhuma avaliação ainda</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Solicite avaliações aos seus pacientes após as consultas. O feedback ajuda a melhorar a qualidade do atendimento.
          </p>
          <Button data-testid="button-solicitar-avaliacao-empty">
            <Plus className="w-4 h-4 mr-2" /> Solicitar Primeira Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
}
