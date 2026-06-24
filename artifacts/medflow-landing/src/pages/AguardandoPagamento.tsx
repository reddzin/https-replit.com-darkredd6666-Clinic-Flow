import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/clinic";

const PLAN_LABELS: Record<string, { name: string; price: string; checkoutUrl: string }> = {
  essencial: { name: "Essencial", price: "R$79/mês", checkoutUrl: "https://pay.cakto.com.br/4aexe9z_913925" },
  pro:       { name: "Pro",       price: "R$137/mês", checkoutUrl: "https://pay.cakto.com.br/dqj8q3m" },
  supreme:   { name: "Supreme",   price: "R$197/mês", checkoutUrl: "https://pay.cakto.com.br/ms5g33h" },
};

export default function AguardandoPagamento() {
  const [, setLocation] = useLocation();
  const session = getSession();

  const [checking, setChecking] = useState(false);
  const [error, setError]       = useState("");
  const [attempts, setAttempts] = useState(0);

  if (!session?.token) { setLocation("/cadastro"); return null; }
  if (!session?.plan)  { setLocation("/cadastro/planos"); return null; }

  const planInfo = PLAN_LABELS[session.plan] ?? { name: session.plan, price: "", checkoutUrl: "" };

  async function handleJaPaguei() {
    if (!session?.email) return;
    setChecking(true);
    setError("");

    try {
      const res = await fetch(`/api/cakto/subscription?email=${encodeURIComponent(session.email)}`);

      if (!res.ok) throw new Error("Erro ao verificar pagamento. Tente novamente.");

      const data = await res.json();

      if (data.canAccess) {
        setLocation("/app/onboarding");
        return;
      }

      setAttempts((n) => n + 1);
      setError(
        "Pagamento não encontrado ainda. O Cakto pode levar alguns segundos para confirmar. Aguarde um momento e tente novamente."
      );
    } catch (e: unknown) {
      setAttempts((n) => n + 1);
      setError(e instanceof Error ? e.message : "Erro inesperado. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">MedFlow</span>
        </div>
        <Link href="/cadastro/planos" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para planos
        </Link>
      </header>

      <main className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center"
        >
          <Clock className="w-9 h-9 text-amber-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-foreground">Finalize seu pagamento</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sua janela de pagamento foi aberta.<br />
            Complete o pagamento no Cakto e depois clique em{" "}
            <strong className="text-foreground">"Já paguei"</strong> para continuar.
          </p>
        </motion.div>

        {/* Resumo do plano */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full bg-background border border-border rounded-2xl p-5 text-left space-y-1"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Plano selecionado</p>
          <p className="font-bold text-foreground text-lg">{planInfo.name}</p>
          <p className="text-sm text-muted-foreground">{planInfo.price} · {session.initialClinicName}</p>
        </motion.div>

        {/* Erro de verificação */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-destructive/8 border border-destructive/30 rounded-xl p-4 flex items-start gap-3 text-left"
            >
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-destructive">Pagamento não confirmado</p>
                <p className="text-xs text-muted-foreground">{error}</p>
                {attempts >= 2 && planInfo.checkoutUrl && (
                  <button
                    onClick={() => window.open(planInfo.checkoutUrl, "_blank")}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Abrir pagamento novamente
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão principal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full space-y-3"
        >
          <Button
            size="lg"
            className="w-full gap-2 text-base"
            onClick={handleJaPaguei}
            disabled={checking}
            data-testid="button-ja-paguei"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando pagamento…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Já paguei, continuar
              </>
            )}
          </Button>

          {planInfo.checkoutUrl && (
            <button
              onClick={() => window.open(planInfo.checkoutUrl, "_blank")}
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir pagamento novamente
            </button>
          )}
        </motion.div>

        <p className="text-xs text-muted-foreground">
          A confirmação pode levar alguns segundos após o pagamento ser processado.
        </p>
      </main>
    </div>
  );
}
