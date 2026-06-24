import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Activity, ArrowLeft } from "lucide-react";
import { saveSession } from "@/lib/clinic";
import { validateName, validateEmail } from "@/lib/validation";

const formSchema = z.object({
  clinica: z
    .string()
    .min(1, "Nome da clínica é obrigatório.")
    .refine((v) => validateName(v) === null, (v) => ({ message: validateName(v) ?? "Nome inválido." })),
  responsavel: z
    .string()
    .min(1, "Nome do responsável é obrigatório.")
    .refine((v) => validateName(v) === null, (v) => ({ message: validateName(v) ?? "Nome inválido." })),
  email: z
    .string()
    .min(1, "E-mail é obrigatório.")
    .refine((v) => validateEmail(v) === null, (v) => ({ message: validateEmail(v) ?? "E-mail inválido." })),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export default function Cadastro() {
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { clinica: "", responsavel: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveSession({
      email: values.email,
      token: "pending_payment",
      userName: values.responsavel,
      initialClinicName: values.clinica,
      clinicName: values.clinica,
      clinicSlug: "",
      onboarding_completed: false,
    });
    setLocation("/cadastro/planos");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-background">
      {/* Brand Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 bg-secondary flex-col justify-between p-12 text-secondary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-secondary/40" />

        <div className="relative z-10 flex flex-col items-end text-right">
          <Link href="/" className="inline-flex items-center gap-2 group mb-12">
            <span className="font-bold text-2xl tracking-tight text-white">MedFlow</span>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
            O futuro da sua clínica <br /> começa aqui.
          </h1>
          <p className="text-secondary-foreground/90 text-lg max-w-md">
            Junte-se a mais de 2.000 clínicas que transformaram sua gestão com o MedFlow.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md self-end">
          <p className="text-white mb-4 italic text-right">
            "A migração foi incrivelmente simples. Em menos de 24 horas nossa equipe já estava usando e adorando a interface."
          </p>
          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <p className="text-white font-medium text-sm">Dr. Carlos Mendes</p>
              <p className="text-secondary-foreground/70 text-xs">Clínica Viver Bem</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">CM</div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto"
      >
        <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {/* Step indicator */}
        <div className="w-full max-w-[450px] mb-6 mt-10 md:mt-0">
          <div className="flex items-center gap-2 mb-6">
            {["Conta", "Plano", "Pagamento", "Configuração"].map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
                {i < 3 && <div className="flex-1 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[450px]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Crie sua conta</h2>
            <p className="text-muted-foreground">Passo 1 de 4 — dados básicos da sua conta.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Clínica</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Clínica São Lucas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome (responsável)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome e sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contato@clinica.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base mt-2"
                disabled={form.formState.isSubmitting}
              >
                Continuar para escolha de plano →
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já possui uma conta?{" "}
            <Link href="/entrar" className="font-medium text-primary hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
