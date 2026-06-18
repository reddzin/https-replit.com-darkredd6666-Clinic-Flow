import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, Users, Heart, TrendingUp, AlertCircle, Activity } from "lucide-react";

const reportCards = [
  { id: "medicos", title: "Desempenho por Médico", desc: "Consultas, receita e avaliação por profissional", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "procedimentos", title: "Procedimentos Mais Realizados", desc: "Ranking dos procedimentos com maior volume", icon: Activity, color: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "convenios", title: "Análise de Convênios", desc: "Volume e receita por operadora de saúde", icon: Heart, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "faltas", title: "Taxa de Falta", desc: "Índice de ausência por período e especialidade", icon: AlertCircle, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "crescimento", title: "Crescimento de Pacientes", desc: "Evolução da base de pacientes ao longo do tempo", icon: TrendingUp, color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "receita", title: "Análise de Receita", desc: "Receita bruta, líquida e inadimplência", icon: BarChart3, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

export default function Relatorios() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecione um relatório para visualizar os dados detalhados
        </p>
        {selected && (
          <Button variant="outline" data-testid="button-exportar-pdf">
            <Download className="w-4 h-4 mr-2" /> Exportar PDF
          </Button>
        )}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelected(selected === card.id ? null : card.id)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              selected === card.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-background hover:border-primary/30 hover:shadow-sm"
            }`}
            data-testid={`card-report-${card.id}`}
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3 border`}>
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Empty State when a report is selected */}
      {selected && (
        <div className="bg-background rounded-2xl border border-border shadow-sm p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Sem dados suficientes para gerar este relatório</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Este relatório estará disponível assim que houver movimentações registradas no sistema. Comece cadastrando pacientes e realizando consultas.
          </p>
          <Button className="mt-6" onClick={() => setSelected(null)} data-testid="button-fechar-relatorio">
            Fechar Relatório
          </Button>
        </div>
      )}
    </div>
  );
}
