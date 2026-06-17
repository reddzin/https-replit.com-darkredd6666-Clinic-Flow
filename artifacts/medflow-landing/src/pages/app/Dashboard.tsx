import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const kpis = [
  {
    label: "Consultas Hoje",
    value: "24",
    change: "+4 vs ontem",
    up: true,
    icon: CalendarCheck,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Novos Pacientes",
    value: "87",
    change: "+12% vs mês anterior",
    up: true,
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Receita do Mês",
    value: "R$ 48.320",
    change: "+8,4% vs mês anterior",
    up: true,
    icon: DollarSign,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Taxa de Ocupação",
    value: "78%",
    change: "-3% vs semana anterior",
    up: false,
    icon: TrendingUp,
    color: "bg-amber-50 text-amber-600",
  },
];

const appointments = [
  { name: "Ana Paula Mendes", specialty: "Cardiologia", time: "08:00", status: "Confirmado" },
  { name: "Roberto Alves", specialty: "Clínica Geral", time: "09:00", status: "Aguardando" },
  { name: "Mariana Costa", specialty: "Dermatologia", time: "09:30", status: "Confirmado" },
  { name: "Carlos Ferreira", specialty: "Ortopedia", time: "10:00", status: "Cancelado" },
  { name: "Juliana Ramos", specialty: "Ginecologia", time: "10:30", status: "Confirmado" },
  { name: "Pedro Souza", specialty: "Neurologia", time: "11:00", status: "Aguardando" },
  { name: "Fernanda Lima", specialty: "Endocrinologia", time: "14:00", status: "Confirmado" },
  { name: "Marcos Oliveira", specialty: "Oftalmologia", time: "15:00", status: "Confirmado" },
];

const activities = [
  { text: "Paciente João Silva confirmou consulta", time: "há 5 min", type: "success" },
  { text: "Prontuário de Ana Paula atualizado", time: "há 18 min", type: "info" },
  { text: "Nova guia TISS gerada — Bradesco Saúde", time: "há 32 min", type: "info" },
  { text: "Consulta de Carlos Ferreira cancelada", time: "há 1h", type: "warning" },
  { text: "Relatório mensal exportado com sucesso", time: "há 2h", type: "success" },
];

const weekData = [65, 78, 90, 72, 88, 95, 80];
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const maxVal = Math.max(...weekData);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    Confirmado: { label: "Confirmado", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    Aguardando: { label: "Aguardando", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
    Cancelado: { label: "Cancelado", cls: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  };
  const s = map[status] ?? map["Aguardando"];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      <s.icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bom dia, Dr. Silva</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setLocation("/app/agendamentos")} data-testid="button-nova-consulta">
          <Plus className="w-4 h-4 mr-2" /> Nova Consulta
        </Button>
        <Button variant="outline" onClick={() => setLocation("/app/pacientes")} data-testid="button-novo-paciente">
          <UserPlus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
        <Button variant="outline" onClick={() => setLocation("/app/financeiro")} data-testid="button-emitir-guia">
          <FileText className="w-4 h-4 mr-2" /> Emitir Guia
        </Button>
        <Button variant="outline" onClick={() => setLocation("/app/relatorios")} data-testid="button-gerar-relatorio">
          <BarChart3 className="w-4 h-4 mr-2" /> Gerar Relatório
        </Button>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="xl:col-span-2 bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Consultas esta semana</h3>
              <p className="text-sm text-muted-foreground">Volume diário de atendimentos</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">Jun 2026</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{val}</span>
                <div className="w-full relative rounded-t-lg overflow-hidden bg-muted/50">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all"
                    style={{ height: `${(val / maxVal) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  a.type === "success" ? "bg-emerald-500" : a.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div>
                  <p className="text-sm text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Consultas de Hoje</h3>
            <p className="text-sm text-muted-foreground">{appointments.length} agendamentos</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setLocation("/app/agendamentos")} data-testid="button-ver-todos">
            Ver todos
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Especialidade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Horário</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {apt.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{apt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{apt.specialty}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{apt.time}</td>
                  <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
