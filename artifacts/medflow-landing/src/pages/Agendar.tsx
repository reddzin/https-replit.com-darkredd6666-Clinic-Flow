import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Clock,
  User,
  CheckCircle2,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Baby,
  Bone,
  SearchX,
} from "lucide-react";
import { getClinicData, type ClinicData } from "@/lib/clinic";

const specialties = [
  { id: "clinica-geral", label: "Clínica Geral", icon: Stethoscope, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "cardiologia", label: "Cardiologia", icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "neurologia", label: "Neurologia", icon: Brain, color: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "oftalmologia", label: "Oftalmologia", icon: Eye, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { id: "pediatria", label: "Pediatria", icon: Baby, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "ortopedia", label: "Ortopedia", icon: Bone, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const availableTimes = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

// ── Loading skeleton ────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30 animate-pulse">
      <div className="h-16 bg-background border-b border-border" />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="h-4 w-1/2 bg-muted rounded-full" />
        <div className="h-2 w-full bg-muted rounded-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 404 ─────────────────────────────────────────────────────────────────────
function ClinicNotFound({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-background border-b border-border h-16 flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">MedFlow</span>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <SearchX className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Clínica não encontrada</h1>
        <p className="text-muted-foreground mb-1">
          Não existe nenhuma clínica cadastrada com o endereço:
        </p>
        <code className="text-sm bg-muted px-3 py-1.5 rounded-lg text-foreground mb-6 font-mono">
          {window.location.origin}/booking/{slug}
        </code>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          Verifique se o link está correto ou entre em contato com a clínica para obter o link atualizado.
        </p>
        <Button variant="outline" onClick={() => setLocation("/")}>
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}

// ── Booking flow ─────────────────────────────────────────────────────────────
type Step = "specialty" | "date" | "info" | "confirm";
const stepLabels = ["Especialidade", "Data e hora", "Seus dados", "Confirmação"];
const stepIndex: Record<Step, number> = { specialty: 0, date: 1, info: 2, confirm: 3 };

function BookingFlow({ clinic }: { clinic: ClinicData }) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("specialty");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const calDays = getCalendarDays(calYear, calMonth);
  const todayNum = today.getDate();
  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
  const isDayDisabled = (d: number) => isCurrentMonth && d < todayNum;

  const currentIndex = stepIndex[step];
  const specialtyLabel = specialties.find((s) => s.id === selectedSpecialty)?.label ?? "";

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">MedFlow</p>
              <p className="text-xs text-muted-foreground leading-tight">{clinic.clinicName}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Agendamento online — gratuito e sem cadastro
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                  i < currentIndex ? "bg-emerald-500 text-white"
                  : i === currentIndex ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}>
                  {i < currentIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === currentIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(currentIndex / (stepLabels.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 – Specialty */}
          {step === "specialty" && (
            <motion.div key="specialty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h2 className="text-xl font-bold text-foreground mb-1">Qual especialidade você precisa?</h2>
              <p className="text-sm text-muted-foreground mb-6">Selecione para ver os horários disponíveis.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specialties.map((sp) => (
                  <button key={sp.id}
                    onClick={() => { setSelectedSpecialty(sp.id); setStep("date"); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                      selectedSpecialty === sp.id ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${sp.color}`}>
                      <sp.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{sp.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 – Date & Time */}
          {step === "date" && (
            <motion.div key="date" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <button onClick={() => setStep("specialty")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <h2 className="text-xl font-bold text-foreground mb-1">Escolha a data</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Especialidade: <span className="font-medium text-foreground">{specialtyLabel}</span>
              </p>
              <div className="bg-background border border-border rounded-2xl p-5 mb-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-semibold text-sm">{monthNames[calMonth]} {calYear}</span>
                  <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((d) => (
                    <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calDays.map((d, i) => (
                    <div key={i}>
                      {d === null ? <div /> : (
                        <button disabled={isDayDisabled(d)} onClick={() => setSelectedDay(d)}
                          className={`w-full aspect-square rounded-xl text-sm font-medium transition-all ${
                            selectedDay === d ? "bg-primary text-primary-foreground shadow-sm"
                            : isDayDisabled(d) ? "text-muted-foreground/30 cursor-not-allowed"
                            : "hover:bg-muted text-foreground"
                          }`}
                        >{d}</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {selectedDay && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Horários disponíveis
                  </h3>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {availableTimes.map((t) => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          selectedTime === t ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border hover:border-primary/50 text-foreground"
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                  <Button className="w-full" disabled={!selectedTime} onClick={() => setStep("info")}>
                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3 – Patient info */}
          {step === "info" && (
            <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <button onClick={() => setStep("date")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <h2 className="text-xl font-bold text-foreground mb-1">Seus dados</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Consulta de <strong>{specialtyLabel}</strong> em{" "}
                {selectedDay}/{(calMonth + 1).toString().padStart(2, "0")}/{calYear} às <strong>{selectedTime}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">📱</span>
                    <input type="tel" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Você receberá a confirmação por WhatsApp.</p>
                </div>
              </div>
              <Button className="w-full mt-6" disabled={!name.trim() || !phone.trim()} onClick={() => setStep("confirm")}>
                Confirmar agendamento <CheckCircle2 className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 4 – Confirmation */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Agendamento confirmado!</h2>
                <p className="text-muted-foreground mb-6">Olá, <strong>{name}</strong>! Sua consulta foi agendada com sucesso.</p>
                <div className="bg-background border border-border rounded-2xl p-5 text-left mb-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Especialidade</p>
                      <p className="text-sm font-medium text-foreground">{specialtyLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data e hora</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDay}/{(calMonth + 1).toString().padStart(2, "0")}/{calYear} às {selectedTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Paciente</p>
                      <p className="text-sm font-medium text-foreground">{name}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Enviaremos a confirmação para o WhatsApp <strong>{phone}</strong>.
                </p>
                <Button variant="outline" onClick={() => setLocation("/")}>Voltar ao início</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        Powered by <span className="font-semibold">MedFlow</span> · Agendamento online para clínicas
      </footer>
    </div>
  );
}

// ── Page entry point ─────────────────────────────────────────────────────────
export default function Agendar() {
  const params = useParams<{ slug: string }>();
  const urlSlug = params.slug ?? "";

  const [status, setStatus] = useState<"loading" | "found" | "notfound">("loading");
  const [clinic, setClinic] = useState<ClinicData | null>(null);

  useEffect(() => {
    // Simulate a brief async lookup (would be a real API call in production)
    const timer = setTimeout(() => {
      const data = getClinicData();
      if (data && data.clinicSlug === urlSlug) {
        setClinic(data);
        setStatus("found");
      } else {
        setStatus("notfound");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [urlSlug]);

  if (status === "loading") return <LoadingSkeleton />;
  if (status === "notfound" || !clinic) return <ClinicNotFound slug={urlSlug} />;
  return <BookingFlow clinic={clinic} />;
}
