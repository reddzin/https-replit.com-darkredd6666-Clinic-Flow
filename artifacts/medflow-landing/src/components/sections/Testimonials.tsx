import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "O MedFlow mudou completamente a dinâmica da nossa clínica. Reduzimos o tempo de espera na recepção em 40% e os médicos adoram a fluidez do prontuário.",
    author: "Dra. Carolina Mendes",
    role: "Diretora Clínica, Instituto Vita",
  },
  {
    quote: "Após testar 4 sistemas diferentes, finalmente encontramos um que une um design belíssimo com funcionalidades robustas para faturamento TISS.",
    author: "Ricardo Silveira",
    role: "Gestor Administrativo, Policlínica São João",
  },
  {
    quote: "A funcionalidade de telemedicina integrada salvou nossa operação durante momentos difíceis. Nossos pacientes elogiam constantemente a facilidade de uso.",
    author: "Dr. Fernando Costa",
    role: "Cardiologista, Clínica Coração & Saúde",
  }
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A escolha dos líderes em saúde</h2>
          <p className="text-lg text-muted-foreground">
            Descubra por que as melhores clínicas do país confiam no MedFlow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col justify-between"
            >
              <div className="mb-6">
                <svg className="w-10 h-10 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg text-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}