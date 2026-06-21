import { motion } from "framer-motion";
import { Calendar, FileText, CreditCard, Video, BarChart3, Bell } from "lucide-react";

const features = [
  {
    title: "Agendamento Inteligente",
    description: "Reduza faltas com lembretes automáticos e permita que pacientes agendem consultas online 24/7.",
    icon: Calendar,
  },
  {
    title: "Prontuário Eletrônico",
    description: "Acesse o histórico completo do paciente em segundos, com modelos personalizáveis por especialidade.",
    icon: FileText,
  },
  {
    title: "Faturamento Simplificado",
    description: "Automatize emissão de guias TISS/TUSS, notas fiscais e controle o fluxo de caixa da clínica.",
    icon: CreditCard,
  },
  {
    title: "Telemedicina Integrada",
    description: "Realize consultas por vídeo com segurança e qualidade, tudo dentro da mesma plataforma.",
    icon: Video,
  },
  {
    title: "Dashboard de Análises",
    description: "Acompanhe métricas de desempenho, taxas de ocupação e receitas em tempo real.",
    icon: BarChart3,
  },
  {
    title: "Notificações Automáticas",
    description: "Mantenha sua equipe e pacientes atualizados via WhatsApp, SMS ou e-mail.",
    icon: Bell,
  }
];

export function Features() {
  return (
    <section id="funcionalidades" className="py-24 bg-[#f0fdf4] relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#111827]">Tudo o que sua clínica precisa</h2>
          <p className="text-lg text-[#6b7280]">
            Uma plataforma unificada projetada para otimizar cada etapa da jornada do paciente e da gestão clínica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#16a34a] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#166534] mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111827]">{feature.title}</h3>
              <p className="text-[#6b7280] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-extrabold mb-6 text-[#111827]">Atendimento sem fronteiras com a Telemedicina MedFlow</h3>
            <p className="text-lg text-[#6b7280] mb-8">
              Expanda o alcance da sua clínica oferecendo consultas virtuais com a mesma qualidade do atendimento presencial. Nossa sala virtual é segura, estável e totalmente integrada ao prontuário.
            </p>
            <ul className="space-y-4">
              {['Vídeo em alta definição (HD)', 'Compartilhamento de tela e exames', 'Prescrição digital com assinatura ICP-Brasil', 'Gravação opcional com consentimento'].map((item, i) => (
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
              src="/feature-telehealth.png"
              alt="Telemedicina"
              className="rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] w-full h-auto object-cover border border-[#e5e7eb]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000';
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
