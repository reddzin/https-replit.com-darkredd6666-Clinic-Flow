import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const STORAGE_KEY = "medflow_patients";

interface Patient {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  nascimento: string;
  createdAt: string;
}

function loadPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePatients(list: Patient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>(loadPatients);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPatients(loadPatients());
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() {
    setNome(""); setTelefone(""); setEmail(""); setNascimento(""); setError("");
  }

  function handleSubmit() {
    if (!nome.trim()) { setError("Informe o nome do paciente."); return; }
    if (!telefone.trim()) { setError("Informe o telefone."); return; }

    const novo: Patient = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      nascimento,
      createdAt: new Date().toISOString(),
    };

    const updated = [novo, ...patients];
    savePatients(updated);
    setPatients(updated);
    setDialogOpen(false);
    resetForm();
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-patients"
          />
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-novo-paciente">
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">
            {patients.length} {patients.length === 1 ? "paciente cadastrado" : "pacientes cadastrados"}
          </p>
        </div>

        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhum paciente cadastrado</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Comece cadastrando o primeiro paciente da sua clínica. Todos os dados ficam seguros aqui.
            </p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-novo-paciente-empty">
              <Plus className="w-4 h-4 mr-2" /> Cadastrar Primeiro Paciente
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground">
              <span>Nome</span>
              <span>Telefone</span>
              <span>E-mail</span>
              <span>Nascimento</span>
            </div>
            {filtered.map((p) => (
              <div key={p.id} className="grid grid-cols-4 px-6 py-3 border-b border-border/50 text-sm items-center hover:bg-muted/30 transition-colors">
                <span className="font-medium text-foreground">{p.nome}</span>
                <span className="text-muted-foreground">{p.telefone}</span>
                <span className="text-muted-foreground">{p.email || "—"}</span>
                <span className="text-muted-foreground">
                  {p.nascimento ? new Date(p.nascimento + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Nenhum paciente encontrado para "{search}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Paciente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input id="nome" placeholder="Nome do paciente" value={nome} onChange={e => setNome(e.target.value)} data-testid="input-nome-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input id="telefone" placeholder="(11) 99999-9999" value={telefone} onChange={e => setTelefone(e.target.value)} data-testid="input-telefone-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="paciente@email.com" value={email} onChange={e => setEmail(e.target.value)} data-testid="input-email-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nascimento">Data de nascimento</Label>
              <Input id="nascimento" type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} data-testid="input-nascimento-paciente" />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} data-testid="button-salvar-paciente">Cadastrar Paciente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
