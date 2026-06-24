import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CAKTO_CHECKOUT_URL = "https://cakto.com.br/checkout";

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

        <div className="space-y-3">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => window.open(CAKTO_CHECKOUT_URL, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Assinar agora
          </Button>

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
        </div>

        <p className="text-xs text-gray-400">
          Em caso de dúvidas, entre em contato com o suporte MedFlow.
        </p>
      </div>
    </div>
  );
}
