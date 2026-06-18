import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
  Clock,
  Link2,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

const kpis = [
  { label: "Consultas Hoje", value: "0", change: "Nenhuma agendada", icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
  { label: "Novos Pacientes", value: "0", change: "Este mês", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { label: "Receita do Mês", value: "R$ 0", change: "Nenhuma entrada", icon: DollarSign, color: "bg-violet-50 text-violet-600" },
  { label: "Taxa de Ocupação", value: "—", change: "Sem dados ainda", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// Simulated clinic slug — would come from auth context in a real app
const CLINIC_SLUG = "clinica-exemplo";
const BOOKING_LINK = `medflow.com.br/${CLINIC_SLUG}`;
const BOOKING_URL = `https://${BOOKING_LINK}`;

function BookingLinkCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_URL);
    } catch {
      // fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = BOOKING_URL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Agende sua consulta de forma rápida e fácil pelo nosso link:\n\n${BOOKING_URL}\n\nEscolha o horário que preferir diretamente pela plataforma. 😊`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener");
  };

  return (
    <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      {/* Green accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl" />

      <div className="pl-3 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
            <Link2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground mb-1.5" style={{ fontSize: 16 }}>
              Seu link de agendamento
            </p>
            <div className="flex items-center bg-muted/70 border border-border rounded-lg px-3 py-2 w-full max-w-sm">
              <span
                className="text-sm text-foreground truncate select-all"
                style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace" }}
              >
                {BOOKING_LINK}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Compartilhe este link para seus pacientes agendarem consultas online.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-stretch xl:flex-row">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className={`gap-2 transition-all ${copied ? "border-emerald-400 text-emerald-600" : ""}`}
            data-testid="button-copiar-link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar link
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleWhatsApp}
            className="gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white border-0"
            data-testid="button-whatsapp"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

// 3D Bar component with CSS transforms
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
  const BAR_MAX = 140;
  const D = 10;
  const barH = maxVal > 0 ? Math.max((value / maxVal) * BAR_MAX, 4) : 4;

  const frontGrad = isActive
    ? "linear-gradient(to top, #0f3460, #1d4ed8)"
    : "linear-gradient(to top, #1e3a8a, #2563eb)";
  const sideColor = isActive ? "#091d3a" : "#172554";
  const topColor = isActive ? "#3b82f6" : "#60a5fa";

  return (
    <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
      <span className="text-xs font-bold text-foreground">{value}</span>
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
            width: 36,
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
              left: 36,
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
              width: 36,
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
            width: 36 + D,
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

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const weekData = [0, 0, 0, 0, 0, 0, 0];
  const maxVal = 1; // avoid division by zero; bars will show minimum height

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo ao MedFlow</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Booking Link Card */}
      <BookingLinkCard />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <ArrowUpRight className="w-3.5 h-3.5" />
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
        {/* 3D Weekly Chart */}
        <div className="xl:col-span-2 bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Consultas esta semana</h3>
              <p className="text-sm text-muted-foreground">Volume diário de atendimentos</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-end gap-3" style={{ paddingLeft: 4, paddingRight: 4 }}>
            {weekData.map((val, i) => (
              <Bar3D
                key={i}
                value={val}
                label={weekDays[i]}
                maxVal={maxVal}
                isActive={i === new Date().getDay() - 1}
                delay={i * 0.07}
              />
            ))}
          </div>
        </div>

        {/* Empty Activity Feed */}
        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Atividade Recente</h3>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
            <p className="text-xs text-muted-foreground mt-1">As ações aparecerão aqui.</p>
          </div>
        </div>
      </div>

      {/* Empty Appointments Table */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Consultas de Hoje</h3>
            <p className="text-sm text-muted-foreground">0 agendamentos</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setLocation("/app/agendamentos")} data-testid="button-ver-todos">
            Ver todos
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarCheck className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Nenhuma consulta agendada para hoje</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Clique em "Nova Consulta" para começar.</p>
          <Button size="sm" onClick={() => setLocation("/app/agendamentos")} data-testid="button-agendar">
            <Plus className="w-4 h-4 mr-2" /> Nova Consulta
          </Button>
        </div>
      </div>
    </div>
  );
}
