import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart3,
  Users,
  Heart,
  TrendingUp,
  AlertCircle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Demo data per report ──────────────────────────────────────────────────────

const PERIOD = "Jan – Jun 2026";

const reportData: Record<string, {
  title: string;
  subtitle: string;
  tableHeaders: string[];
  tableRows: (string | number)[][];
  chartData?: { name: string; value: number; [k: string]: string | number }[];
  chartType?: "bar" | "line" | "pie";
  chartKey?: string;
  chartColor?: string;
  summary?: { label: string; value: string }[];
}> = {
  medicos: {
    title: "Desempenho por Médico",
    subtitle: "Consultas, receita e avaliação por profissional",
    tableHeaders: ["Médico", "Especialidade", "Consultas", "Receita (R$)", "Avaliação"],
    tableRows: [
      ["Dr. Carlos Mendes", "Cardiologia", 142, "28.400,00", "4,9 ⭐"],
      ["Dra. Ana Ferreira", "Neurologia", 128, "25.600,00", "4,8 ⭐"],
      ["Dr. Paulo Lima", "Ortopedia", 115, "23.000,00", "4,7 ⭐"],
      ["Dra. Juliana Costa", "Dermatologia", 98, "19.600,00", "4,9 ⭐"],
      ["Dr. Roberto Souza", "Clínica Geral", 210, "21.000,00", "4,6 ⭐"],
    ],
    chartData: [
      { name: "Carlos", value: 142 },
      { name: "Ana", value: 128 },
      { name: "Paulo", value: 115 },
      { name: "Juliana", value: 98 },
      { name: "Roberto", value: 210 },
    ],
    chartType: "bar",
    chartKey: "value",
    chartColor: "#3b82f6",
    summary: [
      { label: "Total de consultas", value: "693" },
      { label: "Receita total", value: "R$ 117.600,00" },
      { label: "Avaliação média", value: "4,78 ⭐" },
    ],
  },
  procedimentos: {
    title: "Procedimentos Mais Realizados",
    subtitle: "Ranking dos procedimentos com maior volume",
    tableHeaders: ["Procedimento", "Realizações", "Receita (R$)", "% do total"],
    tableRows: [
      ["Consulta Clínica Geral", 310, "31.000,00", "31,2%"],
      ["ECG (Eletrocardiograma)", 180, "27.000,00", "18,1%"],
      ["Consulta Cardiológica", 142, "28.400,00", "14,3%"],
      ["Ultrassonografia", 126, "31.500,00", "12,7%"],
      ["Consulta Neurológica", 128, "25.600,00", "12,9%"],
      ["Raio-X", 107, "10.700,00", "10,8%"],
    ],
    chartData: [
      { name: "Clínica Geral", value: 310 },
      { name: "ECG", value: 180 },
      { name: "Cardiologia", value: 142 },
      { name: "Ultrassom", value: 126 },
      { name: "Neurologia", value: 128 },
      { name: "Raio-X", value: 107 },
    ],
    chartType: "bar",
    chartKey: "value",
    chartColor: "#8b5cf6",
    summary: [
      { label: "Procedimentos distintos", value: "6" },
      { label: "Volume total", value: "993" },
      { label: "Receita total", value: "R$ 154.200,00" },
    ],
  },
  convenios: {
    title: "Análise de Convênios",
    subtitle: "Volume e receita por operadora de saúde",
    tableHeaders: ["Operadora", "Consultas", "Receita (R$)", "Ticket Médio", "% do total"],
    tableRows: [
      ["Unimed", 245, "49.000,00", "R$ 200,00", "34,7%"],
      ["Bradesco Saúde", 187, "37.400,00", "R$ 200,00", "26,5%"],
      ["Particular", 142, "42.600,00", "R$ 300,00", "20,1%"],
      ["Amil", 98, "19.600,00", "R$ 200,00", "13,9%"],
      ["SulAmérica", 34, "6.800,00", "R$ 200,00", "4,8%"],
    ],
    chartData: [
      { name: "Unimed", value: 245 },
      { name: "Bradesco", value: 187 },
      { name: "Particular", value: 142 },
      { name: "Amil", value: 98 },
      { name: "SulAmérica", value: 34 },
    ],
    chartType: "pie",
    chartKey: "value",
    chartColor: "#10b981",
    summary: [
      { label: "Total de consultas", value: "706" },
      { label: "Receita total", value: "R$ 155.400,00" },
      { label: "Ticket médio geral", value: "R$ 220,11" },
    ],
  },
  faltas: {
    title: "Taxa de Falta",
    subtitle: "Índice de ausência por período e especialidade",
    tableHeaders: ["Mês", "Agendados", "Realizados", "Faltas", "Taxa de Falta"],
    tableRows: [
      ["Janeiro", 195, 172, 23, "11,8%"],
      ["Fevereiro", 178, 159, 19, "10,7%"],
      ["Março", 210, 184, 26, "12,4%"],
      ["Abril", 225, 202, 23, "10,2%"],
      ["Maio", 198, 181, 17, "8,6%"],
      ["Junho", 212, 198, 14, "6,6%"],
    ],
    chartData: [
      { name: "Jan", value: 11.8 },
      { name: "Fev", value: 10.7 },
      { name: "Mar", value: 12.4 },
      { name: "Abr", value: 10.2 },
      { name: "Mai", value: 8.6 },
      { name: "Jun", value: 6.6 },
    ],
    chartType: "line",
    chartKey: "value",
    chartColor: "#f59e0b",
    summary: [
      { label: "Taxa média no período", value: "10,1%" },
      { label: "Melhor mês", value: "Junho (6,6%)" },
      { label: "Total de faltas", value: "122 consultas" },
    ],
  },
  crescimento: {
    title: "Crescimento de Pacientes",
    subtitle: "Evolução da base de pacientes ao longo do tempo",
    tableHeaders: ["Mês", "Novos Pacientes", "Total Acumulado", "Crescimento"],
    tableRows: [
      ["Janeiro", 38, 38, "–"],
      ["Fevereiro", 42, 80, "+10,5%"],
      ["Março", 51, 131, "+21,4%"],
      ["Abril", 49, 180, "-3,9%"],
      ["Maio", 63, 243, "+28,6%"],
      ["Junho", 71, 314, "+12,7%"],
    ],
    chartData: [
      { name: "Jan", value: 38 },
      { name: "Fev", value: 42 },
      { name: "Mar", value: 51 },
      { name: "Abr", value: 49 },
      { name: "Mai", value: 63 },
      { name: "Jun", value: 71 },
    ],
    chartType: "line",
    chartKey: "value",
    chartColor: "#ef4444",
    summary: [
      { label: "Total de pacientes", value: "314" },
      { label: "Novos no período", value: "314" },
      { label: "Crescimento médio/mês", value: "+15,1%" },
    ],
  },
  receita: {
    title: "Análise de Receita",
    subtitle: "Receita bruta, líquida e inadimplência",
    tableHeaders: ["Mês", "Receita Bruta", "Receita Líquida", "Inadimplência", "Margem"],
    tableRows: [
      ["Janeiro", "R$ 19.500,00", "R$ 16.575,00", "R$ 390,00", "85,0%"],
      ["Fevereiro", "R$ 17.800,00", "R$ 15.130,00", "R$ 356,00", "85,0%"],
      ["Março", "R$ 21.000,00", "R$ 17.850,00", "R$ 420,00", "85,0%"],
      ["Abril", "R$ 22.500,00", "R$ 19.125,00", "R$ 450,00", "85,0%"],
      ["Maio", "R$ 19.800,00", "R$ 16.830,00", "R$ 396,00", "85,0%"],
      ["Junho", "R$ 21.200,00", "R$ 18.020,00", "R$ 424,00", "85,0%"],
    ],
    chartData: [
      { name: "Jan", value: 19500, liquido: 16575 },
      { name: "Fev", value: 17800, liquido: 15130 },
      { name: "Mar", value: 21000, liquido: 17850 },
      { name: "Abr", value: 22500, liquido: 19125 },
      { name: "Mai", value: 19800, liquido: 16830 },
      { name: "Jun", value: 21200, liquido: 18020 },
    ],
    chartType: "bar",
    chartKey: "value",
    chartColor: "#06b6d4",
    summary: [
      { label: "Receita bruta total", value: "R$ 121.800,00" },
      { label: "Receita líquida total", value: "R$ 103.530,00" },
      { label: "Inadimplência total", value: "R$ 2.436,00 (2,0%)" },
    ],
  },
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ── PDF export ────────────────────────────────────────────────────────────────
function exportPDF(reportId: string) {
  const data = reportData[reportId];
  if (!data) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MedFlow — Relatório Clínico", 14, 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Exportado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 17);
  doc.text(`Período: ${PERIOD}`, pageW - 14, 17, { align: "right" });

  // Title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.title, 14, 36);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(data.subtitle, 14, 43);

  // Summary cards
  if (data.summary) {
    let sx = 14;
    const cardW = (pageW - 28 - (data.summary.length - 1) * 5) / data.summary.length;
    data.summary.forEach((s) => {
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(sx, 50, cardW, 18, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(s.label, sx + 4, 57);
      doc.setFontSize(11);
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.text(s.value, sx + 4, 64);
      sx += cardW + 5;
    });
  }

  // Table
  autoTable(doc, {
    head: [data.tableHeaders],
    body: data.tableRows.map((r) => r.map(String)),
    startY: 76,
    theme: "striped",
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8.5, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [245, 250, 247] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY ?? 200;
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Documento gerado automaticamente pelo MedFlow. Dados de uso exclusivo interno da clínica.", 14, finalY + 10);

  const filename = `medflow-${reportId}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ── Charts ────────────────────────────────────────────────────────────────────
function ReportChart({ id }: { id: string }) {
  const data = reportData[id];
  if (!data?.chartData) return null;

  if (data.chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (data.chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={data.chartColor} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // default bar
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill={data.chartColor} radius={[6, 6, 0, 0]} />
        {data.chartData[0]?.liquido !== undefined && (
          <Bar dataKey="liquido" fill="#10b981" radius={[6, 6, 0, 0]} name="Líquido" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Report detail panel ───────────────────────────────────────────────────────
function ReportDetail({ id }: { id: string }) {
  const data = reportData[id];
  if (!data) return null;

  return (
    <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Summary cards */}
      {data.summary && (
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {data.summary.map((s) => (
            <div key={s.label} className="px-6 py-4">
              <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="p-6 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground mb-4">Visão Gráfica — {PERIOD}</h4>
        <ReportChart id={id} />
      </div>

      {/* Table */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Dados Detalhados</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {data.tableHeaders.map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.tableRows.map((row, i) => (
                <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-4 ${j === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const reportCards = [
  { id: "medicos",       title: "Desempenho por Médico",          desc: "Consultas, receita e avaliação por profissional",     icon: Users,       color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "procedimentos", title: "Procedimentos Mais Realizados",   desc: "Ranking dos procedimentos com maior volume",         icon: Activity,    color: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "convenios",     title: "Análise de Convênios",            desc: "Volume e receita por operadora de saúde",            icon: Heart,       color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "faltas",        title: "Taxa de Falta",                   desc: "Índice de ausência por período e especialidade",     icon: AlertCircle, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "crescimento",   title: "Crescimento de Pacientes",        desc: "Evolução da base de pacientes ao longo do tempo",   icon: TrendingUp,  color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "receita",       title: "Análise de Receita",              desc: "Receita bruta, líquida e inadimplência",            icon: BarChart3,   color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

export default function Relatorios() {
  const [selected, setSelected] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const hasData = selected !== null;

  function handleExport() {
    if (!selected) return;
    setExporting(true);
    setTimeout(() => {
      exportPDF(selected);
      setExporting(false);
    }, 100);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecione um relatório para visualizar os dados detalhados
        </p>
        <div className="relative group">
          <Button
            variant="outline"
            disabled={!hasData || exporting}
            onClick={handleExport}
            data-testid="button-exportar-pdf"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Gerando PDF…" : "Exportar PDF"}
          </Button>
          {!hasData && (
            <div className="absolute right-0 top-full mt-1.5 z-10 hidden group-hover:block">
              <div className="bg-foreground text-background text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                Sem dados para exportar ainda
              </div>
            </div>
          )}
        </div>
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

      {/* Report Detail */}
      {selected && <ReportDetail id={selected} />}
    </div>
  );
}
