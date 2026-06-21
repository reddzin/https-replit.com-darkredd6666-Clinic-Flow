import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">

          {/* Left — text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] font-medium text-sm mb-8 text-[#166534]"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
              A nova era da gestão clínica
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[#166534] mb-6 leading-[1.05]"
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
              className="text-lg md:text-xl text-[#6b7280] mb-10 max-w-xl leading-relaxed"
            >
              O MedFlow centraliza agendamentos, prontuários e faturamento em uma interface premium e intuitiva.
              Projetado para clínicas que exigem o melhor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-base rounded-full bg-[#166534] hover:bg-[#14532d] text-white border-0 shadow-none font-bold"
                onClick={() => setLocation("/cadastro")}
                data-testid="button-hero-start"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base rounded-full border-2 border-[#166534] text-[#166534] bg-transparent hover:bg-[#f0fdf4] font-bold"
                onClick={() => setLocation("/contato")}
              >
                Falar com Consultor
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6 text-sm text-[#6b7280]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Implantação em 48h
              </div>
            </motion.div>
          </div>

          {/* Right — doctor photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-[#f0fdf4] rounded-[2.5rem] -z-10" />
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=85&w=900"
              alt="Médica profissional"
              className="w-full h-[600px] object-cover object-top rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[#e5e7eb]"
            />
            {/* floating stat card */}
            <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.10)] border border-[#e5e7eb] px-6 py-4">
              <p className="text-3xl font-black text-[#166534]">+2.400</p>
              <p className="text-sm text-[#6b7280] font-medium">clínicas ativas</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#166534] rounded-2xl px-6 py-4">
              <p className="text-3xl font-black text-white">98%</p>
              <p className="text-sm text-white/80 font-medium">satisfação</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
