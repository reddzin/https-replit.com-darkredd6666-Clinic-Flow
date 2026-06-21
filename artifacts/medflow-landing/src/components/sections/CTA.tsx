import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CTA() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-24 relative overflow-hidden bg-[#166534]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Quanto está custando não ter o MedFlow?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto"
          >
            Cada falta não evitada, cada guia com erro, cada hora perdida em planilha é dinheiro saindo da sua clínica. Nossa equipe implanta tudo em menos de 48 horas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base rounded-full bg-white text-[#166534] hover:bg-[#f0fdf4] border-0 shadow-none w-full sm:w-auto font-bold"
              onClick={() => setLocation("/cadastro")}
              data-testid="button-cta-start"
            >
              Comece seu Teste Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-2 border-white/40 text-white hover:bg-white/10 w-full sm:w-auto bg-transparent"
              onClick={() => setLocation("/contato")}
              data-testid="button-cta-sales"
            >
              Falar com Consultor
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
