import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Check,
  Zap,
  Star,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { saveSession, getSession, type Plan } from "@/lib/clinic";

const CHECKOUT_URLS: Record<Plan, string> = {
  essencial: "https://pay.cakto.com.br/4aexe9z_913925",
  pro: "https://pay.cakto.com.br/dqj8q3m",
  supreme: "https://pay.cakto.com.br/ms5g33h",
};

const plans: {
  id: Plan;
  name: string;
  price: string;
  priceNote: string;
  icon: typeof Zap;
  color: string;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    id: "essencial",
    name: "Essencial",
    price: "R$79",
    priceNote: "/mês",
    icon: Zap,
    color: "border-border",
    features: [
      "1 médico ativo",
      "Máximo 30 agendamentos/mês",
      "Agendamento online",
      "Prontuários básicos",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$137",
    priceNote: "/mês",
    icon: Star,
    color: "border-primary",
    highlight: true,
    features: [
      "Até 5 médicos ativos",
      "Agendamentos ilimitados",
      "Lista de espera automática",
      "Lembrete 30min antes da consulta",
      "Dashboard completo",
      "Suporte prioritário",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: "R$197",
    priceNote: "/mês",
    icon: Crown,
    color: "border-border",
    features: [
      "Médicos ilimitados",
      "Tudo do plano Pro",
      "Múltiplos links por especialidade",
      "Relatório mensal completo",
      "Múltiplas unidades",
      "Gerente de conta dedicado",
    ],
  },
];

export default function CadastroPlanos() {
  const [, setLocation] = useLocation();
  const session = getSession();
  const [selected, setSelected] = useState<Plan>("pro");

  // Guard: must have gone through /cadastro first
  if (!session?.token) {
    setLocation("/cadastro");
    return null;
  }

  function handleContinue() {
    saveSession({ plan: selected });
    window.open(CHECKOUT_URLS[selected], "_blank");
    setLocation("/cadastro/aguardando-pagamento");
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
        <Link href="/cadastro" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 max-w-md mx-auto">
          {["Conta", "Plano", "Pagamento", "Configuração"].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-emerald-500 text-white" : i === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i === 0 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Escolha seu plano</h1>
          <p className="text-muted-foreground">Olá, <strong>{session.userName}</strong>! Selecione o plano ideal para <strong>{session.initialClinicName}</strong>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelected(plan.id)}
              className={`relative bg-background rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                selected === plan.id
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Mais popular
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                plan.highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <plan.icon className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-xl text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.priceNote}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className={`w-full py-2 rounded-xl border-2 text-sm font-medium text-center transition-all ${
                selected === plan.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:border-primary/50"
              }`}>
                {selected === plan.id ? "✓ Selecionado" : "Selecionar"}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="px-10" onClick={handleContinue}>
            Continuar para pagamento →
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Cancele a qualquer momento. Sem multa ou fidelidade.
          </p>
        </div>
      </main>
    </div>
  );
}
