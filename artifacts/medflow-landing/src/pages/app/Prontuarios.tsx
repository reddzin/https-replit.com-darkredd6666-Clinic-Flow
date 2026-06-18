import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, ShieldCheck, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Prontuarios() {
  const [search, setSearch] = useState("");
  const [accessConfirmed, setAccessConfirmed] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleRequestAccess = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmAccess = () => {
    setAccessConfirmed(true);
    setConfirmDialogOpen(false);
  };

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
        <Button data-testid="button-novo-prontuario">
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
            <Button onClick={handleRequestAccess} data-testid="button-acessar-prontuarios">
              <Eye className="w-4 h-4 mr-2" /> Confirmar Acesso e Visualizar
            </Button>
          </div>
        </div>
      ) : (
        /* Empty state after access confirmed */
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">0 prontuários encontrados</p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Acesso autenticado
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhum prontuário cadastrado</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Os prontuários eletrônicos aparecerão aqui após as primeiras consultas serem realizadas.
            </p>
            <Button data-testid="button-novo-prontuario-empty">
              <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Prontuário
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
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
            <Button onClick={handleConfirmAccess} data-testid="button-confirmar-acesso">
              Confirmar Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
