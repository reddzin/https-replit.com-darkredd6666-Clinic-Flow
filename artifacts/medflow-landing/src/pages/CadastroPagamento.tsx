import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Lock,
  CreditCard,
  Check,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { saveSession, getSession } from "@/lib/clinic";

const planLabels: Record<string, string> = {
  essencial: "Essencial — R$ 149/mês",
  pro: "Pro — R$ 299/mês",
  supreme: "Supreme — R$ 499/mês",
};

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value: string) {
  return value.replace(/\D/g, "").slice(0, 4).replace(/^(.{2})(.+)/, "$1/$2");
}

export default function CadastroPagamento() {
  const [, setLocation] = useLocation();
  const session = getSession();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Guards
  if (!session?.token) { setLocation("/cadastro"); return null; }
  if (!session?.plan) { setLocation("/cadastro/planos"); return null; }

  const planLabel = planLabels[session.plan] ?? session.plan;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) { setError("Número do cartão inválido."); return; }
    if (!cardName.trim()) { setError("Informe o nome impresso no cartão."); return; }
    if (expiry.length < 5) { setError("Data de vencimento inválida."); return; }
    if (cvv.length < 3) { setError("CVV inválido."); return; }

    setError("");
    setProcessing(true);

    // Simulate payment processing (1.8s)
    setTimeout(() => {
      saveSession({ paymentConfirmed: true, token: "active_token" });
      setLocation("/app/onboarding");
    }, 1800);
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">MedFlow</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <Lock className="w-3.5 h-3.5" /> Pagamento seguro
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {["Conta", "Plano", "Pagamento", "Configuração"].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < 2 ? "bg-emerald-500 text-white" : i === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < 2 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === 2 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Dados de pagamento</h1>
          <p className="text-muted-foreground text-sm">Passo 3 de 4 — insira os dados do seu cartão.</p>
        </div>

        {/* Demo banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Ambiente de demonstração.</strong> Nenhuma cobrança real será efetuada. Use qualquer dado fictício para continuar.
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-background border border-border rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Plano selecionado</p>
          <p className="font-semibold text-foreground">{planLabel}</p>
          <p className="text-xs text-muted-foreground mt-1">Clínica: {session.initialClinicName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Número do cartão</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome impresso no cartão</label>
            <input
              type="text"
              placeholder="NOME SOBRENOME"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors uppercase"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Vencimento</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full py-6 text-base" disabled={processing}>
            {processing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Processando pagamento...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Confirmar pagamento e continuar
              </span>
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link href="/cadastro/planos" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para planos
          </Link>
        </div>
      </main>
    </div>
  );
}
