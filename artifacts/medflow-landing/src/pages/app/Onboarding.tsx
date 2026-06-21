import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ChevronRight,
  CheckCircle2,
  Stethoscope,
  Heart,
  Brain,
  Smile,
  Eye,
  Bone,
  Baby,
  Dumbbell,
  MoreHorizontal,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { saveSession, getSession, generateSlug, type Doctor, type BusinessHours } from "@/lib/clinic";

const CLINIC_TYPES = [
  { id: "clinica-geral", label: "Clínica Geral", icon: Stethoscope },
  { id: "cardiologia", label: "Cardiologia", icon: Heart },
  { id: "neurologia", label: "Neurologia", icon: Brain },
  { id: "odontologia", label: "Odontologia", icon: Smile },
  { id: "oftalmologia", label: "Oftalmologia", icon: Eye },
  { id: "ortopedia", label: "Ortopedia", icon: Bone },
  { id: "pediatria", label: "Pediatria", icon: Baby },
  { id: "fisioterapia", label: "Fisioterapia", icon: Dumbbell },
  { id: "outro", label: "Outro", icon: MoreHorizontal },
];

const WEEK_DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

const DEFAULT_HOURS: BusinessHours = {
  seg: { active: true, open: "08:00", close: "18:00" },
  ter: { active: true, open: "08:00", close: "18:00" },
  qua: { active: true, open: "08:00", close: "18:00" },
  qui: { active: true, open: "08:00", close: "18:00" },
  sex: { active: true, open: "08:00", close: "17:00" },
  sab: { active: false, open: "08:00", close: "12:00" },
  dom: { active: false, open: "08:00", close: "12:00" },
};

const DURATIONS = [15, 20, 30, 45, 60, 90];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-emerald-500" : "w-1.5 bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const session = getSession();

  // Guards: must be authenticated
  if (!session?.email || !session?.token) { setLocation("/cadastro"); return null; }
  if (session.onboarding_completed) { setLocation("/app"); return null; }

  const [step, setStep] = useState(0); // 0-4
  const totalSteps = 5;

  // Step 0 – Tipo de clínica
  const [clinicType, setClinicType] = useState(session.clinicType ?? "");

  // Step 1 – Nome e endereço
  const [clinicName, setClinicName] = useState(session.clinicName || session.initialClinicName || "");
  const [clinicAddress, setClinicAddress] = useState(session.clinicAddress ?? "");
  const [clinicPhone, setClinicPhone] = useState(session.clinicPhone ?? "");
  const [clinicCity, setClinicCity] = useState(session.clinicCity ?? "");
  const [clinicState, setClinicState] = useState(session.clinicState ?? "");

  // Step 2 – Horários
  const [hours, setHours] = useState<BusinessHours>(session.businessHours ?? DEFAULT_HOURS);

  // Step 3 – Médicos
  const [doctors, setDoctors] = useState<Doctor[]>(session.doctors ?? []);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, "id">>({ name: "", specialty: "", crm: "" });

  // Step 4 – Duração
  const [duration, setDuration] = useState(session.appointmentDuration ?? 30);

  function canProceed() {
    if (step === 0) return !!clinicType;
    if (step === 1) return clinicName.trim().length >= 2 && clinicAddress.trim().length >= 3;
    if (step === 2) return Object.values(hours).some((h) => h.active);
    if (step === 3) return true; // optional
    if (step === 4) return duration > 0;
    return false;
  }

  function handleNext() {
    if (step === 4) {
      const slug = generateSlug(clinicName);
      saveSession({
        clinicType,
        clinicName,
        clinicSlug: slug,
        clinicAddress,
        clinicPhone,
        clinicCity,
        clinicState,
        businessHours: hours,
        doctors,
        appointmentDuration: duration,
        onboarding_completed: true,
      });
      // Persist to the API so the booking page works from any device
      fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          clinicName,
          clinicType,
          clinicAddress,
          clinicPhone,
          clinicCity,
          clinicState,
          businessHours: hours,
          doctors,
          appointmentDuration: duration,
          ownerEmail: session.email,
        }),
      }).catch(console.error);
      setLocation("/app");
      return;
    }
    // Save progress after each step
    if (step === 0) saveSession({ clinicType });
    if (step === 1) {
      const slug = generateSlug(clinicName);
      saveSession({ clinicName, clinicSlug: slug, clinicAddress, clinicPhone, clinicCity, clinicState });
    }
    if (step === 2) saveSession({ businessHours: hours });
    if (step === 3) saveSession({ doctors });
    setStep((s) => s + 1);
  }

  function addDoctor() {
    if (!newDoctor.name.trim() || !newDoctor.specialty.trim()) return;
    setDoctors((prev) => [...prev, { ...newDoctor, id: crypto.randomUUID() }]);
    setNewDoctor({ name: "", specialty: "", crm: "" });
  }

  function removeDoctor(id: string) {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }

  const stepTitles = [
    "Que tipo de clínica você gerencia?",
    "Nome e endereço da clínica",
    "Horários de funcionamento",
    "Cadastro de médicos",
    "Duração das consultas",
  ];
  const stepSubtitles = [
    "Isso nos ajuda a personalizar o sistema para você.",
    "Esses dados aparecerão na sua página de agendamento.",
    "Configure os dias e horários em que sua clínica atende.",
    "Adicione os profissionais que atuam na clínica. Você pode fazer isso depois.",
    "Defina quanto tempo dura cada consulta padrão.",
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border h-16 flex items-center px-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">MedFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Etapa {step + 1} de {totalSteps}</span>
          <StepDots current={step} total={totalSteps} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-8">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                Configuração da clínica
              </p>
              <h1 className="text-2xl font-bold text-foreground mb-1">{stepTitles[step]}</h1>
              <p className="text-muted-foreground text-sm">{stepSubtitles[step]}</p>
            </div>

            {/* ── Step 0: Tipo de clínica ── */}
            {step === 0 && (
              <div className="grid grid-cols-3 gap-3">
                {CLINIC_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setClinicType(ct.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      clinicType === ct.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      clinicType === ct.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <ct.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center leading-tight">{ct.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Step 1: Nome e endereço ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome da clínica *</label>
                  <input
                    type="text"
                    placeholder="Ex: Clínica São Lucas"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  />
                  {clinicName.trim().length >= 2 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Link de agendamento: <span className="font-mono text-primary">{window.location.origin}{import.meta.env.BASE_URL.replace(/\/$/, "")}/booking/{generateSlug(clinicName)}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Endereço completo *</label>
                  <input
                    type="text"
                    placeholder="Rua, número, bairro"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Cidade</label>
                    <input
                      type="text"
                      placeholder="São Paulo"
                      value={clinicCity}
                      onChange={(e) => setClinicCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Estado</label>
                    <input
                      type="text"
                      placeholder="SP"
                      maxLength={2}
                      value={clinicState}
                      onChange={(e) => setClinicState(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Horários ── */}
            {step === 2 && (
              <div className="space-y-2">
                {WEEK_DAYS.map((day) => {
                  const h = hours[day.id];
                  return (
                    <div
                      key={day.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        h.active ? "bg-background border-border" : "bg-muted/30 border-transparent"
                      }`}
                    >
                      <button
                        onClick={() => setHours((prev) => ({ ...prev, [day.id]: { ...prev[day.id], active: !prev[day.id].active } }))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${
                          h.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {day.label}
                      </button>
                      {h.active ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={h.open}
                            onChange={(e) => setHours((prev) => ({ ...prev, [day.id]: { ...prev[day.id], open: e.target.value } }))}
                            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary"
                          />
                          <span className="text-muted-foreground text-sm">até</span>
                          <input
                            type="time"
                            value={h.close}
                            onChange={(e) => setHours((prev) => ({ ...prev, [day.id]: { ...prev[day.id], close: e.target.value } }))}
                            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Fechado</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Step 3: Médicos ── */}
            {step === 3 && (
              <div>
                <div className="space-y-3 mb-4">
                  {doctors.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {doc.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.specialty}{doc.crm ? ` · CRM ${doc.crm}` : ""}</p>
                      </div>
                      <button onClick={() => removeDoctor(doc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-background border border-border rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Adicionar médico</p>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Especialidade"
                      value={newDoctor.specialty}
                      onChange={(e) => setNewDoctor((p) => ({ ...p, specialty: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="CRM (opcional)"
                      value={newDoctor.crm}
                      onChange={(e) => setNewDoctor((p) => ({ ...p, crm: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDoctor}
                    disabled={!newDoctor.name.trim() || !newDoctor.specialty.trim()}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>

                {doctors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Nenhum médico adicionado. Você pode adicionar depois em <strong>Configurações</strong>.
                  </p>
                )}
              </div>
            )}

            {/* ── Step 4: Duração ── */}
            {step === 4 && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {DURATIONS.map((min) => (
                    <button
                      key={min}
                      onClick={() => setDuration(min)}
                      className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                        duration === min
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <Clock className={`w-5 h-5 ${duration === min ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-lg font-bold ${duration === min ? "text-primary" : "text-foreground"}`}>{min}</span>
                      <span className="text-xs text-muted-foreground">minutos</span>
                    </button>
                  ))}
                </div>

                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Prévia do horário</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex-1 space-y-1">
                      {Array.from({ length: Math.min(4, Math.floor(120 / duration)) }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-10 text-xs font-mono text-right">
                            {`${String(8 + Math.floor((i * duration) / 60)).padStart(2, "0")}:${String((i * duration) % 60).padStart(2, "0")}`}
                          </span>
                          <div className="flex-1 bg-primary/20 rounded h-6 flex items-center px-2">
                            <span className="text-xs text-primary font-medium">Consulta</span>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground mt-1 pl-12">... e assim por diante</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer action */}
        <div className="mt-8 flex items-center justify-between">
          <div />
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8"
          >
            {step === 4 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Concluir e acessar o painel
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continuar <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
