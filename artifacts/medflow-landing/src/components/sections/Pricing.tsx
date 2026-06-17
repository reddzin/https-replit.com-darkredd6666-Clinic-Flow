import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "R$ 199",
    description: "Ideal para consultórios individuais iniciando a digitalização.",
    features: [
      "1 Profissional de Saúde",
      "Agendamento Online",
      "Prontuário Eletrônico Básico",
      "Lembretes por E-mail",
      "Suporte em horário comercial"
    ],
    popular: false,
    buttonVariant: "outline" as const
  },
  {
    name: "Professional",
    price: "R$ 499",
    description: "A solução completa para clínicas em crescimento.",
    features: [
      "Até 5 Profissionais de Saúde",
      "Tudo do plano Basic",
      "Faturamento TISS/TUSS",
      "Telemedicina Integrada",
      "Lembretes por WhatsApp",
      "Dashboard de BI"
    ],
    popular: true,
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: "Sob Consulta",
    description: "Para redes de clínicas e operações de grande volume.",
    features: [
      "Profissionais Ilimitados",
      "Tudo do plano Professional",
      "Múltiplas Unidades",
      "API para Integrações",
      "Gerente de Conta Dedicado",
      "Implantação Presencial"
    ],
    popular: false,
    buttonVariant: "outline" as const
  }
];

export function Pricing() {
  return (
    <section id="precos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos que acompanham seu crescimento</h2>
          <p className="text-lg text-muted-foreground">
            Sem taxas de adesão, cancele quando quiser. Escolha o plano ideal para a sua estrutura.
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
              className={`relative p-8 rounded-3xl border flex flex-col h-full bg-card ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'border-border shadow-sm'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium tracking-wide">
                  Mais Escolhido
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.name !== "Enterprise" && <span className="text-muted-foreground">/mês</span>}
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button variant={plan.buttonVariant} className="w-full h-12 rounded-xl text-base" data-testid={`button-plan-${plan.name.toLowerCase()}`}>
                  {plan.name === "Enterprise" ? "Falar com Vendas" : "Começar Teste Grátis"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}