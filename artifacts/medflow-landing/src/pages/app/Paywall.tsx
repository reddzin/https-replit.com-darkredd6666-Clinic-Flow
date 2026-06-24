import { AlertTriangle, RefreshCw, ExternalLink, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Essencial",
    price: "R$79/mês",
    icon: Zap,
    url: "https://pay.cakto.com.br/4aexe9z_913925",
  },
  {
    name: "Pro",
    price: "R$137/mês",
    icon: Star,
    url: "https://pay.cakto.com.br/dqj8q3m",
    highlight: true,
  },
  {
    name: "Supreme",
    price: "R$197/mês",
    icon: Crown,
    url: "https://pay.cakto.com.br/ms5g33h",
  },
];

const STATUS_LABELS: Record<string, { title: string; desc: string; color: string }> = {
  canceled: {
    title: "Assinatura Cancelada",
    desc: "Sua assinatura foi cancelada. Para continuar usando o MedFlow, assine novamente.",
    color: "text-orange-600",
  },
  payment_failed: {
    title: "Pagamento Recusado",
    desc: "Seu último pagamento foi recusado. Atualize seus dados de pagamento para continuar.",
    color: "text-red-600",
  },
  refunded: {
    title: "Assinatura Reembolsada",
    desc: "Seu pagamento foi reembolsado. Assine novamente para reativar o acesso.",
    color: "text-yellow-600",
  },
  chargeback: {
    title: "Chargeback Registrado",
    desc: "Um chargeback foi registrado na sua conta. Entre em contato para regularizar.",
    color: "text-red-700",
  },
  no_subscription: {
    title: "Sem Assinatura Ativa",
    desc: "Você ainda não possui uma assinatura. Assine para ter acesso completo à plataforma.",
    color: "text-gray-600",
  },
  expired: {
    title: "Acesso Expirado",
    desc: "Seu período de acesso expirou. Renove sua assinatura para continuar.",
    color: "text-orange-600",
  },
};

interface PaywallProps {
  status: string;
  onRetry?: () => void;
}

export default function Paywall({ status, onRetry }: PaywallProps) {
  const info = STATUS_LABELS[status] ?? STATUS_LABELS["no_subscription"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className={`text-xl font-bold ${info.color}`}>{info.title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{info.desc}</p>
        </div>

        <div className="space-y-2">
          {PLANS.map((plan) => (
            <Button
              key={plan.name}
              className={`w-full gap-2 ${plan.highlight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"}`}
              onClick={() => window.open(plan.url, "_blank")}
            >
              <plan.icon className="w-4 h-4" />
              <span className="font-semibold">{plan.name}</span>
              <span className="text-sm opacity-75">— {plan.price}</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          ))}
        </div>

        {onRetry && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="w-4 h-4" />
            Já assinei — verificar acesso
          </Button>
        )}

        <p className="text-xs text-gray-400">
          Em caso de dúvidas, entre em contato com o suporte MedFlow.
        </p>
      </div>
    </div>
  );
}
