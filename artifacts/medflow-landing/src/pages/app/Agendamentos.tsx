import { useState } from "react";
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
import { Plus, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

const hours = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const mockAppointments: Record<string, { name: string; specialty: string; color: string; duration: number }[]> = {
  "08:00-Seg": [{ name: "Ana Paula Mendes", specialty: "Cardiologia", color: "bg-blue-100 text-blue-800 border-blue-200", duration: 1 }],
  "09:00-Ter": [{ name: "Roberto Alves", specialty: "Clínica Geral", color: "bg-emerald-100 text-emerald-800 border-emerald-200", duration: 1 }],
  "10:00-Qua": [{ name: "Mariana Costa", specialty: "Dermatologia", color: "bg-violet-100 text-violet-800 border-violet-200", duration: 1 }],
  "11:00-Qui": [{ name: "Carlos Ferreira", specialty: "Ortopedia", color: "bg-amber-100 text-amber-800 border-amber-200", duration: 1 }],
  "14:00-Sex": [{ name: "Juliana Ramos", specialty: "Ginecologia", color: "bg-rose-100 text-rose-800 border-rose-200", duration: 1 }],
  "09:00-Seg": [{ name: "Pedro Souza", specialty: "Neurologia", color: "bg-cyan-100 text-cyan-800 border-cyan-200", duration: 1 }],
  "15:00-Seg": [{ name: "Fernanda Lima", specialty: "Endocrinologia", color: "bg-orange-100 text-orange-800 border-orange-200", duration: 1 }],
  "10:00-Qua-2": [{ name: "Marcos Oliveira", specialty: "Oftalmologia", color: "bg-indigo-100 text-indigo-800 border-indigo-200", duration: 1 }],
};

const todayApts = [
  { name: "Ana Paula Mendes", specialty: "Cardiologia", time: "08:00", status: "Confirmado" },
  { name: "Pedro Souza", specialty: "Neurologia", time: "09:00", status: "Aguardando" },
  { name: "Fernanda Lima", specialty: "Endocrinologia", time: "15:00", status: "Confirmado" },
];

const filters = ["Todos", "Confirmado", "Aguardando", "Cancelado"];

export default function Agendamentos() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"semana" | "dia">("semana");

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
                view === v ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-view-${v}`}
            >
              {v === "semana" ? "Semana" : "Dia"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-muted" data-testid="button-prev-week"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-medium px-2">16 – 22 Jun 2026</span>
            <button className="p-2 rounded-lg hover:bg-muted" data-testid="button-next-week"><ChevronRight className="w-4 h-4" /></button>
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
        {/* Calendar Grid */}
        <div className="xl:col-span-3 bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b border-border">
            <div className="px-4 py-3 text-xs text-muted-foreground" />
            {weekDays.map((day) => (
              <div key={day} className="px-2 py-3 text-center text-xs font-medium text-muted-foreground border-l border-border">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          <div className="overflow-y-auto max-h-[480px]">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[56px]">
                <div className="px-4 py-2 text-xs text-muted-foreground flex items-start pt-2">{hour}</div>
                {weekDays.map((day, di) => {
                  const key = `${hour}-${day.slice(0, 3)}`;
                  const apts = mockAppointments[key] || [];
                  return (
                    <div key={di} className="border-l border-border/50 p-1 relative">
                      {apts.map((apt, ai) => (
                        <div key={ai} className={`text-xs p-1.5 rounded-lg border ${apt.color} leading-tight cursor-pointer`}>
                          <p className="font-medium truncate">{apt.name.split(" ")[0]}</p>
                          <p className="opacity-70 truncate">{apt.specialty}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Today Sidebar */}
        <div className="bg-background rounded-2xl border border-border shadow-sm p-5">
          <h3 className="font-semibold text-foreground mb-4">Hoje</h3>
          <div className="space-y-3">
            {todayApts.map((apt, i) => (
              <div key={i} className="p-3 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {apt.name[0]}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{apt.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {apt.time}
                  </span>
                  <span className={`text-xs font-medium ${
                    apt.status === "Confirmado" ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 text-sm" onClick={() => setDialogOpen(true)} data-testid="button-add-sidebar">
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="paciente">Paciente</Label>
              <Input id="paciente" placeholder="Buscar paciente..." data-testid="input-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="medico">Médico</Label>
              <Input id="medico" placeholder="Selecionar médico" data-testid="input-medico" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="data">Data</Label>
                <Input id="data" type="date" data-testid="input-data" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hora">Hora</Label>
                <Input id="hora" type="time" data-testid="input-hora" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="convenio">Convênio</Label>
              <Input id="convenio" placeholder="Particular / Convênio" data-testid="input-convenio" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancelar">Cancelar</Button>
            <Button onClick={() => setDialogOpen(false)} data-testid="button-confirmar-consulta">Agendar Consulta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
