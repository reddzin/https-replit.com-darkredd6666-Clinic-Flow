import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart3,
  Users,
  Heart,
  TrendingUp,
  AlertCircle,
  Activity,
  Loader2,
  FileX,
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
import { getSession } from "@/lib/clinic";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartPoint { name: string; value: number; [k: string]: string | number }

interface ReportPayload {
  hasData: boolean;
  summary: { label: string; value: string }[];
  chartData: ChartPoint[];
  chartType: "bar" | "line" | "pie";
  chartColor: string;
  tableHeaders: string[];
  tableRows: (string | number)[][];
}

type ReportsResponse = Record<string, ReportPayload>;

// ── PDF export ────────────────────────────────────────────────────────────────
function exportPDF(reportId: string, payload: ReportPayload, reportTitle: string, reportSubtitle: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MedFlow — Relatório Clínico", 14, 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Exportado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 17);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(reportTitle, 14, 36);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(reportSubtitle, 14, 43);

  if (payload.summary.length > 0) {
    let sx = 14;
    const cardW = (pageW - 28 - (payload.summary.length - 1) * 5) / payload.summary.length;
    payload.summary.forEach((s) => {
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

  if (payload.tableRows.length > 0) {
    autoTable(doc, {
      head: [payload.tableHeaders],
      body: payload.tableRows.map((r) => r.map(String)),
      startY: 76,
      theme: "striped",
      headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 8.5, textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [245, 250, 247] },
      margin: { left: 14, right: 14 },
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text("Nenhum dado registrado ainda para este relatório.", 14, 86);
  }

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Documento gerado automaticamente pelo MedFlow. Dados de uso exclusivo interno da clínica.", 14, finalY + 10);
  doc.save(`medflow-${reportId}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FileX className="w-7 h-7 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">Sem dados suficientes para gerar este relatório</p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Comece cadastrando pacientes e realizando consultas.
      </p>
    </div>
  );
}

// ── Chart ─────────────────────────────────────────────────────────────────────
function ReportChart({ payload }: { payload: ReportPayload }) {
  if (!payload.hasData || payload.chartData.length === 0) return <EmptyState />;

  if (payload.chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={payload.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {payload.chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (payload.chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={payload.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={payload.chartColor} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={payload.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" fill={payload.chartColor} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function ReportDetail({ id, payload, title, subtitle }: { id: string; payload: ReportPayload; title: string; subtitle: string }) {
  const [exporting, setExporting] = useState(false);

  function handleExport() {
    setExporting(true);
    setTimeout(() => { exportPDF(id, payload, title, subtitle); setExporting(false); }, 100);
  }

  return (
    <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Summary cards */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {payload.summary.map((s) => (
          <div key={s.label} className="px-6 py-4">
            <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground">Visão Gráfica</h4>
          <span className="inline-flex">
            <Button
              variant="outline"
              size="sm"
              disabled={!payload.hasData || exporting}
              onClick={handleExport}
              title={!payload.hasData ? "Sem dados para exportar ainda" : undefined}
              className="gap-2"
              data-testid="button-exportar-pdf"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Gerando…" : "Exportar PDF"}
            </Button>
          </span>
        </div>
        <ReportChart payload={payload} />
      </div>

      {/* Table */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Dados Detalhados</h4>
        {payload.tableRows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhum dado registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {payload.tableHeaders.map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payload.tableRows.map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
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
        )}
      </div>
    </div>
  );
}

// ── Report card definitions ───────────────────────────────────────────────────
const reportCards = [
  { id: "medicos",       title: "Desempenho por Médico",        subtitle: "Consultas por profissional da clínica",             icon: Users,       color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "procedimentos", title: "Procedimentos Mais Realizados", subtitle: "Ranking das especialidades com maior volume",       icon: Activity,    color: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "convenios",     title: "Análise de Convênios",          subtitle: "Volume e receita por operadora de saúde",          icon: Heart,       color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "faltas",        title: "Taxa de Falta",                 subtitle: "Índice de cancelamentos por período",              icon: AlertCircle, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "crescimento",   title: "Crescimento de Pacientes",      subtitle: "Evolução da base de pacientes ao longo do tempo", icon: TrendingUp,  color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "receita",       title: "Análise de Receita",            subtitle: "Receita bruta, líquida e inadimplência",          icon: BarChart3,   color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Relatorios() {
  const session = getSession();
  const clinicSlug = session?.clinicSlug ?? "";

  const [selected, setSelected] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!clinicSlug) { setReports({}); return; }
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/clinics/${clinicSlug}/reports`);
      if (!res.ok) throw new Error("not ok");
      const data: ReportsResponse = await res.json();
      setReports(data);
    } catch {
      setFetchError(true);
      setReports({});
    } finally {
      setLoading(false);
    }
  }, [clinicSlug]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const selectedPayload = selected && reports ? reports[selected] : null;
  const selectedCard = reportCards.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Carregando dados da clínica…"
            : fetchError
              ? "Erro ao carregar dados. Verifique a conexão."
              : "Selecione um relatório para visualizar os dados"}
        </p>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
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
            <p className="text-sm text-muted-foreground">{card.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selected && selectedCard && (
        loading ? (
          <div className="bg-background rounded-2xl border border-border shadow-sm flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Calculando métricas…</span>
          </div>
        ) : selectedPayload ? (
          <ReportDetail
            id={selected}
            payload={selectedPayload}
            title={selectedCard.title}
            subtitle={selectedCard.subtitle}
          />
        ) : null
      )}
    </div>
  );
}
