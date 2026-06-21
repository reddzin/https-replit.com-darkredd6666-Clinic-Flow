import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

const STORAGE_KEY = "medflow_appointments";

interface Appointment {
  id: string;
  paciente: string;
  medico: string;
  data: string;
  hora: string;
  convenio: string;
  status: "Confirmado" | "Aguardando" | "Cancelado";
  createdAt: string;
}

function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAppointments(list: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const hours = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const filters = ["Todos", "Confirmado", "Aguardando", "Cancelado"];

export default function Agendamentos() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"semana" | "dia">("semana");
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);

  const [paciente, setPaciente] = useState("");
  const [medico, setMedico] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [convenio, setConvenio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  const isEmpty = appointments.length === 0;

  const filtered = activeFilter === "Todos"
    ? appointments
    : appointments.filter((a) => a.status === activeFilter);

  function resetForm() {
    setPaciente("");
    setMedico("");
    setData("");
    setHora("");
    setConvenio("");
    setError("");
  }

  function handleSubmit() {
    if (!paciente.trim()) { setError("Informe o nome do paciente."); return; }
    if (!medico.trim()) { setError("Informe o médico."); return; }
    if (!data) { setError("Selecione a data."); return; }
    if (!hora) { setError("Selecione o horário."); return; }

    const novo: Appointment = {
      id: crypto.randomUUID(),
      paciente: paciente.trim(),
      medico: medico.trim(),
      data,
      hora,
      convenio: convenio.trim() || "Particular",
      status: "Aguardando",
      createdAt: new Date().toISOString(),
    };

    const updated = [novo, ...appointments];
    saveAppointments(updated);
    setAppointments(updated);
    setDialogOpen(false);
    resetForm();
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
          {(["semana", "dia"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${
                view === v
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-view-${v}`}
            >
              {v === "semana" ? "Semana" : "Dia"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-muted" data-testid="button-prev-week">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2">
              {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <button className="p-2 rounded-lg hover:bg-muted" data-testid="button-next-week">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setDialogOpen(true)} data-testid="button-nova-consulta">
            <Plus className="w-4 h-4 mr-2" /> Nova Consulta
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
            data-testid={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main area */}
        <div className="xl:col-span-3 bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <CalendarCheck className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nenhum agendamento ainda</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                A grade de horários aparecerá aqui quando houver consultas cadastradas. Crie o primeiro agendamento para começar.
              </p>
              <Button onClick={() => setDialogOpen(true)} data-testid="button-agendar-empty">
                <Plus className="w-4 h-4 mr-2" /> Nova Consulta
              </Button>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[600px]">
              {/* Header */}
              <div className="grid grid-cols-5 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
                <span>Paciente</span>
                <span>Médico</span>
                <span>Data</span>
                <span>Horário</span>
                <span>Status</span>
              </div>
              {filtered.map((appt) => (
                <div key={appt.id} className="grid grid-cols-5 px-4 py-3 border-b border-border/50 text-sm items-center hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">{appt.paciente}</span>
                  <span className="text-muted-foreground">{appt.medico}</span>
                  <span className="text-muted-foreground">{new Date(appt.data + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                  <span className="text-muted-foreground">{appt.hora}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                    appt.status === "Confirmado" ? "bg-emerald-50 text-emerald-700" :
                    appt.status === "Cancelado" ? "bg-rose-50 text-rose-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{appt.status}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum agendamento com este filtro.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today Sidebar */}
        <div className="bg-background rounded-2xl border border-border shadow-sm p-5 flex flex-col">
          <h3 className="font-semibold text-foreground mb-4">Hoje</h3>
          {appointments.filter(a => a.data === new Date().toISOString().split("T")[0]).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <CalendarCheck className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">Nenhum agendamento</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-2">
              {appointments.filter(a => a.data === new Date().toISOString().split("T")[0]).map(a => (
                <div key={a.id} className="text-sm p-3 rounded-xl bg-muted/50">
                  <p className="font-medium">{a.hora} — {a.paciente}</p>
                  <p className="text-xs text-muted-foreground">{a.medico}</p>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full text-sm mt-4"
            onClick={() => setDialogOpen(true)}
            data-testid="button-add-sidebar"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Consulta
          </Button>
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="paciente">Paciente *</Label>
              <Input id="paciente" placeholder="Nome do paciente" value={paciente} onChange={e => setPaciente(e.target.value)} data-testid="input-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="medico">Médico *</Label>
              <Input id="medico" placeholder="Nome do médico" value={medico} onChange={e => setMedico(e.target.value)} data-testid="input-medico" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="data">Data *</Label>
                <Input id="data" type="date" value={data} onChange={e => setData(e.target.value)} data-testid="input-data" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hora">Hora *</Label>
                <Input id="hora" type="time" value={hora} onChange={e => setHora(e.target.value)} data-testid="input-hora" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="convenio">Convênio</Label>
              <Input id="convenio" placeholder="Particular / Convênio" value={convenio} onChange={e => setConvenio(e.target.value)} data-testid="input-convenio" />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} data-testid="button-cancelar">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} data-testid="button-confirmar-consulta">
              Agendar Consulta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
