import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O MedFlow é compatível com os padrões exigidos pela ANS?",
    answer: "Sim. Nosso sistema é 100% compatível com a TISS e TUSS mais recentes, garantindo que o faturamento de convênios seja processado sem glosas."
  },
  {
    question: "Como funciona a migração de dados de outro sistema?",
    answer: "Temos uma equipe dedicada à migração de dados. Importamos seus cadastros de pacientes, agendamentos e prontuários históricos de forma segura e sem custo adicional."
  },
  {
    question: "O prontuário eletrônico é customizável?",
    answer: "Absolutamente. O MedFlow permite a criação de modelos de anamnese e evolução específicos para a sua especialidade, acelerando o registro em cada consulta."
  },
  {
    question: "É seguro armazenar dados de pacientes na nuvem?",
    answer: "O MedFlow utiliza infraestrutura de servidores com certificação HIPAA e LGPD. Todos os dados são criptografados de ponta a ponta e backups são realizados automaticamente."
  },
  {
    question: "Posso acessar o sistema do celular?",
    answer: "Sim. O MedFlow é totalmente responsivo e pode ser acessado de qualquer smartphone ou tablet, permitindo que você consulte a agenda ou prontuários onde estiver."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Tudo o que você precisa saber sobre o MedFlow.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}