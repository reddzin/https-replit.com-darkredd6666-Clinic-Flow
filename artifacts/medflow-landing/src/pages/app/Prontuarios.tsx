import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, FileText, ShieldCheck, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const STORAGE_KEY = "medflow_prontuarios";

interface Prontuario {
  id: string;
  paciente: string;
  medico: string;
  data: string;
  queixa: string;
  observacoes: string;
  createdAt: string;
}

function loadProntuarios(): Prontuario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProntuarios(list: Prontuario[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Prontuarios() {
  const [search, setSearch] = useState("");
  const [accessConfirmed, setAccessConfirmed] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>(loadProntuarios);

  const [paciente, setPaciente] = useState("");
  const [medico, setMedico] = useState("");
  const [data, setData] = useState("");
  const [queixa, setQueixa] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProntuarios(loadProntuarios());
  }, []);

  const filtered = prontuarios.filter(
    (p) =>
      p.paciente.toLowerCase().includes(search.toLowerCase()) ||
      p.medico.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() {
    setPaciente(""); setMedico(""); setData(""); setQueixa(""); setObservacoes(""); setError("");
  }

  function handleSubmit() {
    if (!paciente.trim()) { setError("Informe o paciente."); return; }
    if (!medico.trim()) { setError("Informe o médico."); return; }
    if (!data) { setError("Selecione a data."); return; }
    if (!queixa.trim()) { setError("Informe a queixa principal."); return; }

    const novo: Prontuario = {
      id: crypto.randomUUID(),
      paciente: paciente.trim(),
      medico: medico.trim(),
      data,
      queixa: queixa.trim(),
      observacoes: observacoes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [novo, ...prontuarios];
    saveProntuarios(updated);
    setProntuarios(updated);
    setNewDialogOpen(false);
    resetForm();
  }

  function handleNewDialogChange(open: boolean) {
    setNewDialogOpen(open);
    if (!open) resetForm();
  }

  function openNew() {
    resetForm();
    setNewDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prontuários..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-records"
          />
        </div>
        <Button onClick={openNew} data-testid="button-novo-prontuario">
          <Plus className="w-4 h-4 mr-2" /> Novo Prontuário
        </Button>
      </div>

      {/* Privacy Gate */}
      {!accessConfirmed ? (
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Área de dados clínicos protegida</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-2">
              O acesso a prontuários contém informações clínicas sensíveis protegidas pelo sigilo médico e pela LGPD.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mb-6">
              Ao continuar, você confirma que está autorizado a acessar esses dados e que este acesso será registrado em log de auditoria.
            </p>
            <Button onClick={() => setConfirmDialogOpen(true)} data-testid="button-acessar-prontuarios">
              <Eye className="w-4 h-4 mr-2" /> Confirmar Acesso e Visualizar
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {prontuarios.length} {prontuarios.length === 1 ? "prontuário encontrado" : "prontuários encontrados"}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Acesso autenticado
            </span>
          </div>

          {prontuarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nenhum prontuário cadastrado</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                Os prontuários eletrônicos aparecerão aqui após as primeiras consultas serem realizadas.
              </p>
              <Button onClick={openNew} data-testid="button-novo-prontuario-empty">
                <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Prontuário
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-4 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground">
                <span>Paciente</span>
                <span>Médico</span>
                <span>Data</span>
                <span>Queixa Principal</span>
              </div>
              {filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-4 px-6 py-3 border-b border-border/50 text-sm items-center hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">{p.paciente}</span>
                  <span className="text-muted-foreground">{p.medico}</span>
                  <span className="text-muted-foreground">
                    {new Date(p.data + "T12:00:00").toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-muted-foreground truncate">{p.queixa}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Nenhum prontuário encontrado para "{search}".
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Privacy Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Confirmar acesso a prontuários
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-2">
              Você está prestes a acessar dados clínicos sensíveis. Este acesso será registrado com sua identificação, data e horário para fins de auditoria. Confirme apenas se estiver autorizado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} data-testid="button-cancelar-acesso">
              Cancelar
            </Button>
            <Button onClick={() => { setAccessConfirmed(true); setConfirmDialogOpen(false); }} data-testid="button-confirmar-acesso">
              Confirmar Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Prontuário Dialog */}
      <Dialog open={newDialogOpen} onOpenChange={handleNewDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Prontuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="pron-paciente">Paciente *</Label>
              <Input id="pron-paciente" placeholder="Nome do paciente" value={paciente} onChange={e => setPaciente(e.target.value)} data-testid="input-pron-paciente" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pron-medico">Médico *</Label>
              <Input id="pron-medico" placeholder="Nome do médico" value={medico} onChange={e => setMedico(e.target.value)} data-testid="input-pron-medico" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pron-data">Data da consulta *</Label>
              <Input id="pron-data" type="date" value={data} onChange={e => setData(e.target.value)} data-testid="input-pron-data" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pron-queixa">Queixa principal *</Label>
              <Input id="pron-queixa" placeholder="Descreva a queixa principal" value={queixa} onChange={e => setQueixa(e.target.value)} data-testid="input-pron-queixa" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pron-obs">Observações</Label>
              <Input id="pron-obs" placeholder="Observações adicionais" value={observacoes} onChange={e => setObservacoes(e.target.value)} data-testid="input-pron-obs" />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleNewDialogChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} data-testid="button-salvar-prontuario">Salvar Prontuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
