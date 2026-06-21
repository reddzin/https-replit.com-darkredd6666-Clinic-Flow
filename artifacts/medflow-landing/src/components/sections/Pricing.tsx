import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const plans = [
  {
    name: "Essencial",
    price: "R$79",
    badge: "Limitado",
    badgeStyle: "bg-[#6b7280] text-white",
    borderStyle: "border border-[#e5e7eb]",
    description: "Para consultórios individuais que querem profissionalizar o atendimento.",
    features: [
      "1 Profissional de Saúde",
      "Agendamento Online",
      "Prontuário Eletrônico Básico",
      "Lembretes por E-mail",
      "Suporte em horário comercial",
    ],
    popular: false,
    buttonClass: "bg-[#166534] hover:bg-[#14532d] text-white border-0",
  },
  {
    name: "Pro",
    price: "R$137",
    badge: "Mais popular",
    badgeStyle: "bg-[#16a34a] text-white",
    borderStyle: "border-2 border-[#16a34a] shadow-lg shadow-[#16a34a]/10",
    description: "Para clínicas em crescimento que precisam de controle total.",
    features: [
      "Até 5 Profissionais de Saúde",
      "Tudo do plano Essencial",
      "Faturamento TISS/TUSS",
      "Telemedicina Integrada",
      "Lembretes por WhatsApp",
      "Dashboard de BI",
    ],
    popular: true,
    buttonClass: "bg-[#16a34a] hover:bg-[#166534] text-white border-0",
  },
  {
    name: "Supreme",
    price: "R$197",
    badge: "Premium",
    badgeStyle: "bg-[#166534] text-white",
    borderStyle: "border-2 border-[#166534] shadow-lg shadow-[#166534]/10",
    description: "Para redes e operações de grande volume.",
    features: [
      "Profissionais Ilimitados",
      "Tudo do plano Pro",
      "Múltiplas Unidades",
      "API para Integrações",
      "Gerente de Conta Dedicado",
      "Implantação Presencial",
    ],
    popular: false,
    buttonClass: "bg-[#166534] hover:bg-[#14532d] text-white border-0",
  },
];

export function Pricing() {
  const [, setLocation] = useLocation();

  return (
    <section id="precos" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#111827]">
            Planos que crescem com você
          </h2>
          <p className="text-lg text-[#6b7280]">
            Sem fidelidade, sem taxa de adesão. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl flex flex-col h-full bg-white ${plan.borderStyle}`}
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${plan.badgeStyle}`}>
                {plan.badge}
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 text-[#111827]">{plan.name}</h3>
                <p className="text-[#6b7280] text-sm min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#166534]">{plan.price}</span>
                  <span className="text-[#6b7280]">/mês</span>
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#16a34a] shrink-0" />
                      <span className="text-sm text-[#111827]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  className={`w-full h-12 rounded-xl text-base ${plan.buttonClass}`}
                  onClick={() => setLocation("/cadastro")}
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  Começar Teste Grátis
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
