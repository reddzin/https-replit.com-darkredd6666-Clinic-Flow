import { motion } from "framer-motion";
import { Calendar, FileText, CreditCard, Video, BarChart3, Bell } from "lucide-react";

const features = [
  {
    title: "Agendamento Inteligente",
    description: "Pacientes agendam online 24h. Lembretes automáticos cortam faltas em até 40%.",
    icon: Calendar,
  },
  {
    title: "Prontuário Eletrônico",
    description: "Histórico completo do paciente em segundos. Modelos por especialidade prontos para usar.",
    icon: FileText,
  },
  {
    title: "Faturamento Simplificado",
    description: "Guias TISS, notas fiscais e fluxo de caixa no automático. Zero erro manual.",
    icon: CreditCard,
  },
  {
    title: "Telemedicina Integrada",
    description: "Consultas por vídeo com qualidade presencial, integradas ao prontuário em tempo real.",
    icon: Video,
  },
  {
    title: "Dashboard de Análises",
    description: "Saiba exatamente quanto sua clínica fatura, quais horários rendem mais e onde está perdendo dinheiro.",
    icon: BarChart3,
  },
  {
    title: "Notificações Automáticas",
    description: "WhatsApp, SMS e e-mail disparados na hora certa, sem a recepcionista precisar lembrar.",
    icon: Bell,
  }
];

export function Features() {
  return (
    <section id="funcionalidades" className="py-28 bg-[#f0fdf4] relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#111827]">Tudo que sua clínica precisa. Em um lugar só.</h2>
          <p className="text-lg text-[#6b7280]">
            Pare de pagar por 5 sistemas diferentes. O MedFlow substitui todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#16a34a] hover:shadow-[0_4px_16px_rgba(22,163,74,0.08)] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#166534] mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black mb-3 text-[#111827]">{feature.title}</h3>
              <p className="text-[#6b7280] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-black mb-6 text-[#111827]">Atenda mais sem ampliar o espaço físico</h3>
            <p className="text-lg text-[#6b7280] mb-8">
              Com a telemedicina do MedFlow, sua clínica funciona onde o paciente estiver. Segura, estável e integrada ao prontuário — sem instalar nada.
            </p>
            <ul className="space-y-4">
              {['Vídeo HD sem travamento', 'Compartilhe tela e laudos na consulta', 'Prescrição digital com validade ICP-Brasil', 'Gravação com consentimento do paciente'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#166534]" />
                  </div>
                  <span className="text-[#111827] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=85&w=900"
              alt="Telemedicina"
              className="rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full h-[420px] object-cover border border-[#e5e7eb]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
