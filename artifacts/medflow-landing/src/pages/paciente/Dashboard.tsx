import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  CalendarCheck,
  Clock,
  X,
  RotateCcw,
  Star,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPatientSession, clearPatientSession, getPatientToken } from "@/lib/patient";

interface Appointment {
  id: number;
  clinicSlug: string;
  clinicName: string | null;
  doctorName: string | null;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reviewed: boolean;
  createdAt: string;
}

function statusLabel(status: string) {
  if (status === "cancelled") return { text: "Cancelada", cls: "bg-red-50 text-red-600" };
  if (status === "completed") return { text: "Concluída", cls: "bg-emerald-50 text-emerald-600" };
  return { text: "Agendada", cls: "bg-blue-50 text-blue-600" };
}

function isFuture(date: string, time: string) {
  const dt = new Date(`${date}T${time}`);
  return dt > new Date();
}

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const availableTimes = ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

// ── Reschedule modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appt, onClose, onDone }: { appt: Appointment; onClose: () => void; onDone: () => void }) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calDays = getCalendarDays(calYear, calMonth);
  const todayNum = today.getDate();
  const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
  const isDayDisabled = (d: number) => isCurrentMonth && d <= todayNum;

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  async function handleReschedule() {
    if (!selectedDay || !selectedTime) return;
    setLoading(true);
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    try {
      await fetch(`/api/patients/appointments/${appt.id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getPatientToken()}` },
        body: JSON.stringify({ appointmentDate: dateStr, appointmentTime: selectedTime }),
      });
      onDone();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Remarcar consulta</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {appt.specialty} · {appt.clinicName ?? appt.clinicSlug}
        </p>
        <div className="bg-muted/40 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold">{monthNames[calMonth]} {calYear}</span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d) => <div key={d} className="text-center text-xs text-muted-foreground py-1">{d[0]}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {calDays.map((d, i) => (
              <div key={i}>
                {d === null ? <div /> : (
                  <button disabled={isDayDisabled(d)} onClick={() => setSelectedDay(d)}
                    className={`w-full aspect-square rounded-lg text-xs font-medium transition-all ${
                      selectedDay === d ? "bg-primary text-primary-foreground"
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
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {availableTimes.map((t) => (
              <button key={t} onClick={() => setSelectedTime(t)}
                className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedTime === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-foreground"
                }`}
              >{t}</button>
            ))}
          </div>
        )}
        <Button className="w-full" disabled={!selectedDay || !selectedTime || loading} onClick={handleReschedule}>
          {loading ? "Salvando..." : "Confirmar remarcação"}
        </Button>
      </motion.div>
    </div>
  );
}

// ── Review modal ──────────────────────────────────────────────────────────────
function ReviewModal({ appt, onClose, onDone }: { appt: Appointment; onClose: () => void; onDone: () => void }) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!stars) return;
    setLoading(true);
    try {
      // Submit review to the existing reviews API
      await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug: appt.clinicSlug,
          rating: stars,
          comment: text,
          reviewerName: "Paciente",
        }),
      });
      // Mark as reviewed
      await fetch(`/api/patients/appointments/${appt.id}/mark-reviewed`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getPatientToken()}` },
      });
      onDone();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Avaliar consulta</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{appt.specialty} · {appt.clinicName ?? appt.clinicSlug}</p>
        <div className="flex gap-2 mb-4 justify-center">
          {[1,2,3,4,5].map((s) => (
            <button key={s} onClick={() => setStars(s)}>
              <Star className={`w-8 h-8 transition-all ${s <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Deixe um comentário (opcional)..."
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors resize-none mb-4"
        />
        <Button className="w-full" disabled={!stars || loading} onClick={handleSubmit}>
          {loading ? "Enviando..." : "Enviar avaliação"}
        </Button>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function PacienteDashboard() {
  const [, setLocation] = useLocation();
  const session = getPatientSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [reviewing, setReviewing] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    if (!session) { setLocation("/paciente/login"); return; }
    fetchAppointments();
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patients/appointments", {
        headers: { Authorization: `Bearer ${getPatientToken()}` },
      });
      if (res.ok) {
        setAppointments(await res.json());
      } else if (res.status === 401) {
        clearPatientSession();
        setLocation("/paciente/login");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleCancel(appt: Appointment) {
    if (!confirm("Cancelar esta consulta?")) return;
    await fetch(`/api/patients/appointments/${appt.id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getPatientToken()}` },
    });
    fetchAppointments();
  }

  function handleLogout() {
    clearPatientSession();
    setLocation("/paciente/login");
  }

  const filtered = appointments.filter((a) => {
    if (filter === "upcoming") return isFuture(a.appointmentDate, a.appointmentTime) && a.status === "scheduled";
    if (filter === "past") return !isFuture(a.appointmentDate, a.appointmentTime) || a.status !== "scheduled";
    return true;
  });

  function formatDate(date: string) {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm hidden sm:block">MedFlow</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">{session.name}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-muted text-muted-foreground" title="Sair">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Minhas Consultas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Histórico de todas as suas consultas pelo MedFlow.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {([["all","Todas"],["upcoming","Futuras"],["past","Passadas"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === val ? "bg-primary text-primary-foreground shadow-sm" : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Appointments list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-28 bg-background rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Nenhuma consulta encontrada.</p>
            <p className="text-xs text-muted-foreground mt-1">Seus agendamentos aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filtered.map((appt) => {
                const { text: statusText, cls: statusCls } = statusLabel(appt.status);
                const future = isFuture(appt.appointmentDate, appt.appointmentTime) && appt.status === "scheduled";
                const canReview = !future && appt.status !== "cancelled" && !appt.reviewed;

                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-background border border-border rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{appt.specialty}</p>
                          <p className="text-xs text-muted-foreground">{appt.clinicName ?? appt.clinicSlug}</p>
                          {appt.doctorName && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3" /> {appt.doctorName}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusCls}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {formatDate(appt.appointmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.appointmentTime}
                      </span>
                    </div>

                    {/* Action buttons */}
                    {(future || canReview) && (
                      <div className="flex gap-2 flex-wrap">
                        {future && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              onClick={() => setRescheduling(appt)}
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Remarcar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                              onClick={() => handleCancel(appt)}
                            >
                              <X className="w-3.5 h-3.5" /> Cancelar
                            </Button>
                          </>
                        )}
                        {canReview && (
                          <Button
                            size="sm"
                            className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-0"
                            onClick={() => setReviewing(appt)}
                          >
                            <Star className="w-3.5 h-3.5" /> Avaliar
                          </Button>
                        )}
                        {!future && appt.reviewed && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Avaliada
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Reschedule modal */}
      {rescheduling && (
        <RescheduleModal
          appt={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={() => { setRescheduling(null); fetchAppointments(); }}
        />
      )}

      {/* Review modal */}
      {reviewing && (
        <ReviewModal
          appt={reviewing}
          onClose={() => setReviewing(null)}
          onDone={() => { setReviewing(null); fetchAppointments(); }}
        />
      )}
    </div>
  );
}
