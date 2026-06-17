import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CTA() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Eleve o padrão da sua clínica hoje mesmo
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto"
          >
            Junte-se a milhares de profissionais que já transformaram a gestão de suas clínicas com o MedFlow.
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
              className="h-14 px-8 text-base rounded-full bg-white text-primary hover:bg-white/90 shadow-xl border-0 w-full sm:w-auto"
              onClick={() => setLocation("/cadastro")}
              data-testid="button-cta-start"
            >
              Comece seu Teste Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-white/30 text-white hover:bg-white/10 w-full sm:w-auto bg-transparent"
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
