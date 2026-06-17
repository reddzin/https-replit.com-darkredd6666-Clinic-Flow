import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Agendamento Inteligente",
    description: "O paciente agenda a consulta online ou via recepção. Lembretes são enviados automaticamente via WhatsApp."
  },
  {
    number: "02",
    title: "Recepção Eficiente",
    description: "Check-in rápido na clínica com verificação de elegibilidade de convênios em tempo real."
  },
  {
    number: "03",
    title: "Atendimento de Excelência",
    description: "O médico acessa o prontuário completo, prescreve medicamentos digitais e solicita exames."
  },
  {
    number: "04",
    title: "Faturamento Automático",
    description: "Guias geradas instantaneamente, com faturamento integrado e relatórios financeiros claros."
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O fluxo perfeito para sua clínica</h2>
          <p className="text-lg text-muted-foreground">
            Veja como o MedFlow transforma a rotina desde a marcação da consulta até o faturamento.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border hidden md:block -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pt-8 md:pt-0"
              >
                <div className="bg-card border border-border p-6 rounded-2xl relative z-10 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-6 md:-top-10 left-1/2 md:left-auto md:right-auto md:-translate-x-0 -translate-x-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-background">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 mt-4 md:mt-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-secondary/10 border border-secondary/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Pronto para transformar sua clínica?</h3>
          <p className="text-lg text-muted-foreground mb-0">
            A implantação é guiada por nossos especialistas e leva menos de 48 horas para você começar a operar com força total.
          </p>
        </div>
      </div>
    </section>
  );
}