import { motion } from "framer-motion";

const stats = [
  { value: "+2.500", label: "Clínicas Ativas" },
  { value: "10M+", label: "Pacientes Gerenciados" },
  { value: "50M+", label: "Consultas Agendadas" },
  { value: "99,9%", label: "Uptime do Sistema" },
];

export function Stats() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{stat.value}</div>
              <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}