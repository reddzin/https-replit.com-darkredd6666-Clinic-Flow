import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users } from "lucide-react";

export default function Pacientes() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, médico..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-patients"
          />
        </div>
        <Button data-testid="button-novo-paciente">
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      {/* Table shell */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">0 pacientes cadastrados</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nenhum paciente cadastrado</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Comece cadastrando o primeiro paciente da sua clínica. Todos os dados ficam seguros aqui.
          </p>
          <Button data-testid="button-novo-paciente-empty">
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Primeiro Paciente
          </Button>
        </div>
      </div>
    </div>
  );
}
