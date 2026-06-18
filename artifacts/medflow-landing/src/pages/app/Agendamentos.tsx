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
import { Plus, ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

const hours = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const filters = ["Todos", "Confirmado", "Aguardando", "Cancelado"];

// Replace with real data when available
const appointments: unknown[] = [];

export default function Agendamentos() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"semana" | "dia">("semana");
  const isEmpty = appointments.length === 0;

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
        {/* Calendar Grid */}
        <div className="xl:col-span-3 bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          {isEmpty ? (
            /* Full empty state — shown when no appointments exist */
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
            /* Calendar grid — only shown when there are appointments */
            <>
              <div className="grid grid-cols-8 border-b border-border">
                <div className="px-4 py-3 text-xs text-muted-foreground" />
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-3 text-center text-xs font-medium text-muted-foreground border-l border-border"
                  >
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>
              <div className="overflow-y-auto max-h-[520px]">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[56px]">
                    <div className="px-4 py-2 text-xs text-muted-foreground flex items-start pt-2">{hour}</div>
                    {weekDays.map((_, di) => (
                      <div key={di} className="border-l border-border/50 p-1" />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Today Sidebar */}
        <div className="bg-background rounded-2xl border border-border shadow-sm p-5 flex flex-col">
          <h3 className="font-semibold text-foreground mb-4">Hoje</h3>
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <CalendarCheck className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground mb-1">Nenhum agendamento</p>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => setDialogOpen(true)}
            data-testid="button-add-sidebar"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Consulta
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancelar">
              Cancelar
            </Button>
            <Button onClick={() => setDialogOpen(false)} data-testid="button-confirmar-consulta">
              Agendar Consulta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
