import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, ArrowLeft } from "lucide-react";
import { generateSlug, saveClinicData } from "@/lib/clinic";

const formSchema = z.object({
  clinica: z.string().min(2, "O nome da clínica é obrigatório"),
  responsavel: z.string().min(2, "O nome do responsável é obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo de clínica"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function Cadastro() {
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { clinica: "", responsavel: "", tipo: "", email: "", telefone: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const slug = generateSlug(values.clinica);
    saveClinicData({ email: values.email, token: "mock_token", clinicName: values.clinica, clinicSlug: slug });
    setLocation("/app");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-background">
      {/* Brand Panel - Mirrored */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 bg-secondary flex-col justify-between p-12 text-secondary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-secondary/40"></div>
        
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
            "A migração foi incrivelmente simples. Em menos de 24 horas nossa equipe já estava usando o sistema e adorando a interface intuitiva."
          </p>
          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <p className="text-white font-medium text-sm">Dr. Carlos Mendes</p>
              <p className="text-secondary-foreground/70 text-xs">Clínica Viver Bem</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              CM
            </div>
          </div>
        </div>
      </motion.div>

      {/* Register Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto"
      >
        <Link href="/" className="absolute top-6 left-6 md:hidden lg:flex inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        
        <div className="w-full max-w-[450px] my-8 md:my-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Crie sua conta</h2>
            <p className="text-muted-foreground">Experimente o MedFlow grátis por 14 dias. Sem cartão de crédito.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clinica"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome da Clínica</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua Clínica" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Especialidade Principal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="geral">Clínica Geral</SelectItem>
                          <SelectItem value="odontologia">Odontologia</SelectItem>
                          <SelectItem value="cardiologia">Cardiologia</SelectItem>
                          <SelectItem value="oftalmologia">Oftalmologia</SelectItem>
                          <SelectItem value="ortopedia">Ortopedia</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@clinica.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
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
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full py-6 text-base mt-2" data-testid="button-register-submit">
                Criar conta e acessar
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já possui uma conta?{" "}
            <Link href="/entrar" className="font-medium text-primary hover:underline" data-testid="link-to-login">
              Fazer login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}