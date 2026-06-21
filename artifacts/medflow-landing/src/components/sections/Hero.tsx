import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] font-medium text-sm mb-6 text-[#166534]"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
            A nova era da gestão clínica
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#166534] mb-8 leading-tight"
          >
            Gestão de Clínicas, <br />
            <span className="text-[#16a34a]">
              Elevada à Perfeição.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#6b7280] mb-10 max-w-2xl mx-auto"
          >
            O MedFlow centraliza agendamentos, prontuários e faturamento em uma interface premium e intuitiva.
            Projetado para clínicas que exigem o melhor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-14 px-10 text-base rounded-full bg-[#166534] hover:bg-[#14532d] text-white border-0 shadow-none"
              onClick={() => setLocation("/cadastro")}
              data-testid="button-hero-start"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-base rounded-full border-2 border-[#166534] text-[#166534] bg-transparent hover:bg-[#f0fdf4]"
              onClick={() => setLocation("/contato")}
            >
              Falar com Consultor
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-[#6b7280]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Implantação em 48h
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <img
              src="/hero-mockup.png"
              alt="MedFlow Dashboard"
              className="w-full h-auto rounded-xl object-cover border border-[#e5e7eb]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000";
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
