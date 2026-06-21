import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const kpis = [
  { label: "Receita Bruta", value: "R$ 0", raw: 0, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Receita Líquida", value: "R$ 0", raw: 0, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
  { label: "Inadimplência", value: "R$ 0", raw: 0, icon: TrendingDown, color: "bg-amber-50 text-amber-600" },
  { label: "Guias Pendentes", value: "R$ 0", raw: 0, icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
];

const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
const monthData = [0, 0, 0, 0, 0, 0];
const periods = ["Este mês", "Último trimestre", "Este ano"];

const hasData = kpis.some((k) => k.raw > 0) || monthData.some((v) => v > 0);

// ── PDF export ────────────────────────────────────────────────────────────────
function exportFinanceiroPDF(period: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MedFlow — Relatório Financeiro", 14, 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Exportado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 17);
  doc.text(`Período: ${period}`, pageW - 14, 17, { align: "right" });

  // Title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Financeiro", 14, 36);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Período selecionado: ${period}`, 14, 43);

  // KPI summary cards
  const cards = kpis;
  const cardW = (pageW - 28 - (cards.length - 1) * 4) / cards.length;
  let sx = 14;
  cards.forEach((k) => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(sx, 50, cardW, 18, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(k.label, sx + 3, 57);
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.text(k.value, sx + 3, 64);
    sx += cardW + 4;
  });

  // Receita mensal table
  autoTable(doc, {
    head: [["Mês", "Receita (R$)"]],
    body: monthLabels.map((m, i) => [m, monthData[i] > 0 ? `R$ ${monthData[i].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"]),
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
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY ?? 180;
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Documento gerado automaticamente pelo MedFlow. Dados de uso exclusivo interno da clínica.",
    14,
    finalY + 10,
  );

  const filename = `medflow-financeiro-${period.toLowerCase().replace(/ /g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// 3D Bar component
function Bar3D({
  value,
  label,
  maxVal,
  isActive = false,
  delay = 0,
}: {
  value: number;
  label: string;
  maxVal: number;
  isActive?: boolean;
  delay?: number;
}) {
  const BAR_MAX = 160;
  const D = 10;
  const barH = maxVal > 0 ? Math.max((value / maxVal) * BAR_MAX, 4) : 4;

  const frontGrad = isActive
    ? "linear-gradient(to top, #0f3460, #1d4ed8)"
    : "linear-gradient(to top, #1e3a8a, #2563eb)";
  const sideColor = isActive ? "#091d3a" : "#172554";
  const topColor = isActive ? "#3b82f6" : "#60a5fa";

  return (
    <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
      <span className="text-xs font-bold text-foreground">
        {value > 0 ? `R$${(value / 1000).toFixed(0)}k` : "—"}
      </span>
      <div
        style={{
          height: BAR_MAX + D + 8,
          display: "flex",
          alignItems: "flex-end",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay }}
          style={{
            transformOrigin: "bottom",
            position: "relative",
            width: 44,
            height: barH,
            marginBottom: 4,
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: frontGrad,
              borderRadius: "3px 3px 0 0",
              zIndex: 1,
            }}
          />
          {/* Right face */}
          <div
            style={{
              position: "absolute",
              top: D * 0.5,
              left: 44,
              width: D,
              height: `calc(100% - ${D * 0.5}px)`,
              background: sideColor,
              transform: "skewY(-45deg)",
              transformOrigin: "top left",
              zIndex: 0,
            }}
          />
          {/* Top face */}
          <div
            style={{
              position: "absolute",
              top: -(D * 0.5),
              left: D * 0.5,
              width: 44,
              height: D,
              background: topColor,
              transform: "skewX(-45deg)",
              transformOrigin: "bottom left",
              zIndex: 2,
            }}
          />
        </motion.div>
        {/* Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 44 + D,
            height: 5,
            background: "rgba(0,0,0,0.10)",
            filter: "blur(4px)",
            borderRadius: "50%",
          }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Financeiro() {
  const [period, setPeriod] = useState("Este mês");
  const maxVal = 1;

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
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-period-${p.toLowerCase().replace(/ /g, "-")}`}
            >
              {p}
            </button>
          ))}
        </div>

        <span title={!hasData ? "Sem dados para exportar ainda" : undefined} className="inline-flex">
          <Button
            variant="outline"
            data-testid="button-exportar"
            disabled={!hasData}
            onClick={() => exportFinanceiroPDF(period)}
            className={!hasData ? "cursor-not-allowed opacity-50" : ""}
          >
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* 3D Revenue Chart */}
      <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Receita Mensal</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <span className="text-sm text-muted-foreground">Sem dados ainda</span>
        </div>
        <div className="flex items-end gap-4" style={{ paddingLeft: 4, paddingRight: 4 }}>
          {monthData.map((val, i) => (
            <Bar3D
              key={i}
              value={val}
              label={monthLabels[i]}
              maxVal={maxVal}
              isActive={i === monthData.length - 1}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Empty Transactions */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Lançamentos</h3>
            <p className="text-sm text-muted-foreground">0 transações</p>
          </div>
          <Button size="sm" variant="outline" data-testid="button-emitir-guia">
            <FileText className="w-4 h-4 mr-2" /> Emitir Guia
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <DollarSign className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nenhum lançamento registrado</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            As transações financeiras aparecerão aqui assim que houver movimentações na clínica.
          </p>
        </div>
      </div>
    </div>
  );
}
