import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Phone, Calendar, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const patients = [
  { id: 1, name: "Ana Paula Mendes", cpf: "***.***.***-12", age: 34, lastVisit: "12/06/2026", doctor: "Dr. Carlos Lima", status: "Ativo", phone: "(11) 98765-4321", plan: "Bradesco Saúde", email: "ana.paula@email.com" },
  { id: 2, name: "Roberto Alves", cpf: "***.***.***-45", age: 52, lastVisit: "08/06/2026", doctor: "Dra. Fernanda Melo", status: "Ativo", phone: "(21) 99887-6543", plan: "Particular", email: "roberto@email.com" },
  { id: 3, name: "Mariana Costa", cpf: "***.***.***-78", age: 28, lastVisit: "01/06/2026", doctor: "Dr. Paulo Rocha", status: "Ativo", phone: "(31) 97654-3210", plan: "Unimed", email: "mariana@email.com" },
  { id: 4, name: "Carlos Ferreira", cpf: "***.***.***-90", age: 61, lastVisit: "25/05/2026", doctor: "Dr. Carlos Lima", status: "Inativo", phone: "(11) 96543-2109", plan: "SulAmérica", email: "carlos@email.com" },
  { id: 5, name: "Juliana Ramos", cpf: "***.***.***-23", age: 41, lastVisit: "10/06/2026", doctor: "Dra. Fernanda Melo", status: "Ativo", phone: "(11) 95432-1098", plan: "Amil", email: "juliana@email.com" },
  { id: 6, name: "Pedro Souza", cpf: "***.***.***-56", age: 37, lastVisit: "15/06/2026", doctor: "Dr. Paulo Rocha", status: "Ativo", phone: "(21) 94321-0987", plan: "Particular", email: "pedro@email.com" },
  { id: 7, name: "Fernanda Lima", cpf: "***.***.***-89", age: 46, lastVisit: "05/06/2026", doctor: "Dr. Carlos Lima", status: "Ativo", phone: "(11) 93210-9876", plan: "Bradesco Saúde", email: "fernanda@email.com" },
  { id: 8, name: "Marcos Oliveira", cpf: "***.***.***-01", age: 29, lastVisit: "17/06/2026", doctor: "Dra. Fernanda Melo", status: "Ativo", phone: "(11) 92109-8765", plan: "Unimed", email: "marcos@email.com" },
  { id: 9, name: "Beatriz Santos", cpf: "***.***.***-34", age: 55, lastVisit: "03/06/2026", doctor: "Dr. Paulo Rocha", status: "Ativo", phone: "(31) 91098-7654", plan: "SulAmérica", email: "beatriz@email.com" },
  { id: 10, name: "Lucas Moreira", cpf: "***.***.***-67", age: 32, lastVisit: "19/05/2026", doctor: "Dr. Carlos Lima", status: "Inativo", phone: "(11) 90987-6543", plan: "Amil", email: "lucas@email.com" },
];

const visitHistory = [
  { date: "12/06/2026", specialty: "Cardiologia", doctor: "Dr. Carlos Lima", type: "Consulta", status: "Realizada" },
  { date: "15/03/2026", specialty: "Cardiologia", doctor: "Dr. Carlos Lima", type: "Retorno", status: "Realizada" },
  { date: "01/11/2025", specialty: "Clínica Geral", doctor: "Dra. Fernanda Melo", type: "Consulta", status: "Realizada" },
];

function Initials({ name }: { name: string }) {
  const parts = name.split(" ");
  return <>{parts[0][0]}{parts[parts.length - 1]?.[0] ?? ""}</>;
}

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof patients[0] | null>(null);
  const [activeTab, setActiveTab] = useState("dados");

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, médico..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-patients"
            />
          </div>
          <Button variant="outline" data-testid="button-filter">
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </Button>
        </div>
        <Button data-testid="button-novo-paciente">
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{filtered.length} pacientes encontrados</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">CPF</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Médico</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Última Consulta</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelected(p)}
                  data-testid={`row-patient-${p.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${colors[i % colors.length]}`}>
                        <Initials name={p.name} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.age} anos · {p.plan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{p.cpf}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{p.doctor}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" /> {p.lastVisit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "Ativo" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                    <Initials name={selected.name} />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">{selected.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.age} anos · {selected.plan}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex gap-1 border-b border-border mb-4">
                {["dados", "histórico"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                      activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`tab-patient-${tab}`}
                  >
                    {tab === "dados" ? "Dados Pessoais" : "Histórico"}
                  </button>
                ))}
              </div>

              {activeTab === "dados" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">CPF</p>
                      <p className="text-sm font-medium">{selected.cpf}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Convênio</p>
                      <p className="text-sm font-medium">{selected.plan}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Médico responsável</p>
                      <p className="text-sm font-medium">{selected.doctor}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Última consulta</p>
                      <p className="text-sm font-medium">{selected.lastVisit}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Telefone</p>
                    <p className="text-sm font-medium">{selected.phone}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium">{selected.email}</p>
                  </div>
                  <Button className="w-full" data-testid="button-agendar-retorno">Agendar Retorno</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {visitHistory.map((v, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{v.specialty}</span>
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{v.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.doctor} · {v.type}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {v.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
