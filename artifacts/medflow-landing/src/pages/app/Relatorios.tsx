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

const medicoData = [
  { name: "Dr. Carlos Lima", specialty: "Cardiologia", consultas: 142, receita: "R$ 49.700", avaliacao: 4.9 },
  { name: "Dra. Fernanda Melo", specialty: "Clínica Geral", consultas: 198, receita: "R$ 35.640", avaliacao: 4.8 },
  { name: "Dr. Paulo Rocha", specialty: "Neurologia", consultas: 97, receita: "R$ 40.740", avaliacao: 4.7 },
];

const procedimentoData = [
  { name: "Consulta Cardiologista", count: 142, pct: 100 },
  { name: "Consulta Clínica Geral", count: 198, pct: 100 },
  { name: "Ecocardiograma", count: 88, pct: 62 },
  { name: "Holter 24h", count: 67, pct: 47 },
  { name: "Consulta Neurologia", count: 97, pct: 68 },
];

const convenioData = [
  { name: "Bradesco Saúde", volume: 234, receita: "R$ 64.350", pct: 100 },
  { name: "Unimed", volume: 187, receita: "R$ 51.425", pct: 80 },
  { name: "Amil", volume: 145, receita: "R$ 39.875", pct: 62 },
  { name: "SulAmérica", volume: 98, receita: "R$ 26.950", pct: 42 },
  { name: "Particular", volume: 76, receita: "R$ 20.900", pct: 33 },
];

const maxProcedimento = Math.max(...procedimentoData.map(d => d.count));

export default function Relatorios() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Selecione um relatório para visualizar os dados detalhados</p>
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

      {/* Detail Panel */}
      {selected === "medicos" && (
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Desempenho por Médico — Jun 2026</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Médico</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Especialidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Consultas</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Receita</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {medicoData.map((m, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {m.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{m.specialty}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{m.consultas}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">{m.receita}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      ★ {m.avaliacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected === "procedimentos" && (
        <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-6">Procedimentos Mais Realizados — Jun 2026</h3>
          <div className="space-y-4">
            {procedimentoData.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-sm font-semibold text-foreground">{p.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(p.count / maxProcedimento) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected === "convenios" && (
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Análise de Convênios — Jun 2026</h3>
          </div>
          <div className="p-6 space-y-4">
            {convenioData.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{c.volume} consultas</span>
                    <span className="font-semibold text-foreground">{c.receita}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(selected === "faltas" || selected === "crescimento" || selected === "receita") && (
        <div className="bg-background rounded-2xl border border-border shadow-sm p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Relatório em preparação</h3>
          <p className="text-sm text-muted-foreground">Este relatório está sendo gerado. Em produção, os dados reais seriam exibidos aqui.</p>
          <Button className="mt-6" data-testid="button-solicitar-relatorio">Solicitar Relatório</Button>
        </div>
      )}
    </div>
  );
}
