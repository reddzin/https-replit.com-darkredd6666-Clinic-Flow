import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UsersRound, Plus, ArrowUp, Lock } from "lucide-react";
import { getSession } from "@/lib/clinic";

export default function ListaDeEspera() {
  const [, setLocation] = useLocation();
  const session = getSession();
  const plan = (session?.plan ?? "essencial") as "essencial" | "pro" | "supreme";
  const [hasAccess] = useState(plan === "pro" || plan === "supreme");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gerencie pacientes aguardando uma vaga de consulta.
        </p>
        {hasAccess && (
          <Button data-testid="button-adicionar-espera">
            <Plus className="w-4 h-4 mr-2" /> Adicionar à Fila
          </Button>
        )}
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden relative">
        <div className={hasAccess ? "" : "blur-sm pointer-events-none select-none"}>
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground">0 pacientes na fila</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <UsersRound className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Lista de espera vazia</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Adicione pacientes que aguardam uma vaga de consulta. Eles serão notificados automaticamente quando houver disponibilidade.
            </p>
            <Button data-testid="button-adicionar-espera-empty">
              <Plus className="w-4 h-4 mr-2" /> Adicionar à Fila
            </Button>
          </div>
        </div>

        {!hasAccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Recurso disponível no plano Pro</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              A Lista de Espera está disponível nos planos <strong>Pro</strong> e <strong>Supreme</strong>. Faça upgrade para gerenciar filas de espera, notificar pacientes automaticamente e reduzir cancelamentos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setLocation("/cadastro/planos")} data-testid="button-upgrade-plan">
                <ArrowUp className="w-4 h-4 mr-2" /> Fazer Upgrade para Pro
              </Button>
              <Button variant="outline" onClick={() => setLocation("/cadastro/planos")} data-testid="button-ver-planos">
                Ver Planos
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Plano atual: <span className="font-semibold capitalize">{plan}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
