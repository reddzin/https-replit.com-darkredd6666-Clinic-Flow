import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-[#f0fdf4] scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#111827]">Clínicas que decidiram crescer com o MedFlow</h2>
          <p className="text-lg text-[#6b7280]">
            Seja o próximo caso de sucesso.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center py-16 px-8 rounded-3xl border border-[#dcfce7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-[#166534]" />
          </div>
          <h3 className="text-xl font-bold text-[#166534] mb-3">Em breve</h3>
          <p className="text-[#6b7280] leading-relaxed">
            Estamos coletando os primeiros depoimentos dos nossos clientes. Seja um dos pioneiros e ajude a construir essa história.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
