import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Download,
  ArrowUpRight,
} from "lucide-react";

const kpis = [
  { label: "Receita Bruta", value: "R$ 48.320", change: "+8,4%", up: true, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Receita Líquida", value: "R$ 41.072", change: "+6,1%", up: true, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
  { label: "Inadimplência", value: "R$ 2.140", change: "-12%", up: false, icon: TrendingDown, color: "bg-amber-50 text-amber-600" },
  { label: "Guias Pendentes", value: "R$ 5.108", change: "+3 guias", up: false, icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
];

const monthlyData = [
  { month: "Jan", value: 38200 },
  { month: "Fev", value: 41500 },
  { month: "Mar", value: 39800 },
  { month: "Abr", value: 44100 },
  { month: "Mai", value: 45600 },
  { month: "Jun", value: 48320 },
];

const transactions = [
  { date: "17/06/2026", patient: "Ana Paula Mendes", procedure: "Consulta Cardiologista", value: "R$ 350,00", method: "Bradesco Saúde", status: "Pago" },
  { date: "17/06/2026", patient: "Pedro Souza", procedure: "Consulta Neurologista", value: "R$ 420,00", method: "Particular", status: "Pago" },
  { date: "16/06/2026", patient: "Mariana Costa", procedure: "Consulta Dermatologista", value: "R$ 280,00", method: "Unimed", status: "Pendente" },
  { date: "15/06/2026", patient: "Fernanda Lima", procedure: "Consulta + Exames", value: "R$ 680,00", method: "Bradesco Saúde", status: "Pago" },
  { date: "15/06/2026", patient: "Carlos Ferreira", procedure: "Consulta Ortopedia", value: "R$ 390,00", method: "SulAmérica", status: "Cancelado" },
  { date: "14/06/2026", patient: "Juliana Ramos", procedure: "Consulta Ginecologista", value: "R$ 310,00", method: "Amil", status: "Pago" },
  { date: "14/06/2026", patient: "Roberto Alves", procedure: "Retorno Clínica Geral", value: "R$ 180,00", method: "Particular", status: "Pendente" },
  { date: "13/06/2026", patient: "Marcos Oliveira", procedure: "Consulta Oftalmologista", value: "R$ 260,00", method: "Unimed", status: "Pago" },
];

const periods = ["Este mês", "Último trimestre", "Este ano"];

const maxVal = Math.max(...monthlyData.map(d => d.value));

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pago: "bg-emerald-50 text-emerald-700",
    Pendente: "bg-amber-50 text-amber-700",
    Cancelado: "bg-red-50 text-red-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map["Pendente"]}`}>
      {status}
    </span>
  );
}

export default function Financeiro() {
  const [period, setPeriod] = useState("Este mês");

  return (
    <div className="space-y-6">
      {/* Period Filter + Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                period === p ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-period-${p.toLowerCase().replace(/ /g, "-")}`}
            >
              {p}
            </button>
          ))}
        </div>
        <Button variant="outline" data-testid="button-exportar">
          <Download className="w-4 h-4 mr-2" /> Exportar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-amber-600"}`}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Receita Mensal</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +26,5% no período
          </span>
        </div>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                R$ {(d.value / 1000).toFixed(1)}k
              </span>
              <div
                className={`w-full rounded-t-lg ${i === monthlyData.length - 1 ? "bg-primary" : "bg-primary/30"}`}
                style={{ height: `${(d.value / maxVal) * 180}px` }}
              />
              <span className="text-xs text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Lançamentos</h3>
            <p className="text-sm text-muted-foreground">{transactions.length} transações encontradas</p>
          </div>
          <Button size="sm" variant="outline" data-testid="button-emitir-guia">
            <FileText className="w-4 h-4 mr-2" /> Emitir Guia
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Procedimento</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Pagamento</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Valor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors" data-testid={`row-transaction-${i}`}>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{t.patient}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{t.procedure}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{t.method}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{t.value}</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
