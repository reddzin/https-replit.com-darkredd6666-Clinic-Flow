import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";

// Replace with real data when available
const reviews: unknown[] = [];

const starDistribution = [5, 4, 3, 2, 1];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Star
      className={`w-4 h-4 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
    />
  );
}

export default function Avaliacoes() {
  const isEmpty = reviews.length === 0;
  const totalReviews = reviews.length;
  const avgRating = 0;
  const positivePct = 0;
  const negativePct = 0;

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Acompanhe a satisfação dos pacientes com os atendimentos realizados.
        </p>
        <Button variant="outline" data-testid="button-solicitar-avaliacao">
          <Plus className="w-4 h-4 mr-2" /> Solicitar Avaliação
        </Button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Nota Média */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Nota Média</p>
          <p className="text-3xl font-bold text-foreground mb-1">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= Math.round(avgRating)} />
            ))}
          </div>
        </div>

        {/* Total de Avaliações */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Total de Avaliações</p>
          <p className="text-3xl font-bold text-foreground mb-1">{totalReviews}</p>
          <p className="text-xs text-muted-foreground">
            {totalReviews === 0 ? "Nenhuma recebida ainda" : "avaliações recebidas"}
          </p>
        </div>

        {/* % Positivas */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Avaliações Positivas</p>
          <p className="text-3xl font-bold text-emerald-600 mb-1">
            {totalReviews > 0 ? `${positivePct}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalReviews > 0 ? "notas 4 e 5 estrelas" : "Sem dados ainda"}
          </p>
        </div>

        {/* % Negativas */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Avaliações Negativas</p>
          <p className="text-3xl font-bold text-rose-500 mb-1">
            {totalReviews > 0 ? `${negativePct}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalReviews > 0 ? "notas 1 e 2 estrelas" : "Sem dados ainda"}
          </p>
        </div>
      </div>

      {/* Star Distribution Chart */}
      <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">Distribuição por Estrelas</h3>
        <div className="space-y-3">
          {starDistribution.map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= stars} />
                ))}
              </div>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right">0</span>
            </div>
          ))}
        </div>
        {isEmpty && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            O gráfico será preenchido quando houver avaliações.
          </p>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {totalReviews === 1 ? "1 avaliação recebida" : `${totalReviews} avaliações recebidas`}
          </p>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhuma avaliação recebida ainda</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Solicite avaliações aos seus pacientes após as consultas. O feedback ajuda a melhorar a qualidade do atendimento e atrair novos pacientes.
            </p>
            <Button data-testid="button-solicitar-avaliacao-empty">
              <Plus className="w-4 h-4 mr-2" /> Solicitar Primeira Avaliação
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* review cards would render here */}
          </div>
        )}
      </div>
    </div>
  );
}
