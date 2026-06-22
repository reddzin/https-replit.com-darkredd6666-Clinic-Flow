import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Activity, ArrowLeft, LayoutDashboard, ShieldCheck, ChevronRight } from "lucide-react";
import { getSession, saveSession } from "@/lib/clinic";

const ADMIN_EMAIL = "igorsilvaarcini1@hotmail.com";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const [showAdminChoice, setShowAdminChoice] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.email && session?.token) {
      if (session.onboarding_completed) {
        setLocation("/app");
      } else {
        setLocation("/app/onboarding");
      }
    }
  }, [setLocation]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveSession({ email: values.email, token: "mock_token" });

    if (values.email === ADMIN_EMAIL) {
      setShowAdminChoice(true);
      return;
    }

    const session = getSession();
    if (session?.onboarding_completed) {
      setLocation("/app");
    } else {
      setLocation("/app/onboarding");
    }
  }

  function goAdmin() {
    setLocation("/admin");
  }

  function goClinic() {
    const session = getSession();
    if (session?.onboarding_completed) {
      setLocation("/app");
    } else {
      setLocation("/app/onboarding");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Brand Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-12">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">MedFlow</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
            Gestão clínica inteligente, <br />
            resultados extraordinários.
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Automatize processos, reduza faltas e ofereça a melhor experiência para seus pacientes.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md">
          <p className="text-white mb-4 italic">
            "Desde que implementamos o MedFlow, nossa taxa de comparecimento aumentou em 40% e a equipe de recepção trabalha com muito mais tranquilidade."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              DR
            </div>
            <div>
              <p className="text-white font-medium text-sm">Dra. Renata Silva</p>
              <p className="text-primary-foreground/70 text-xs">Diretora Clínica, Clínica Saúde Integrada</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative"
      >
        <Link
          href="/"
          className="absolute top-6 left-6 md:hidden lg:flex inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {showAdminChoice ? (
              /* Admin choice screen */
              <motion.div
                key="admin-choice"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5">
                  <ShieldCheck className="w-8 h-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo, Igor</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Você tem acesso de admin. Para onde quer ir?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={goAdmin}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-400 transition-all text-left group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Painel Admin</p>
                      <p className="text-xs text-muted-foreground">Ver avaliações do MedFlow</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-600 transition-colors" />
                  </button>

                  <button
                    onClick={goClinic}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-background hover:bg-muted/60 hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Conta da Clínica</p>
                      <p className="text-xs text-muted-foreground">Entrar no painel normal</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>

                <button
                  onClick={() => setShowAdminChoice(false)}
                  className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Voltar ao login
                </button>
              </motion.div>
            ) : (
              /* Normal login form */
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Bem-vindo de volta</h2>
                  <p className="text-muted-foreground">Insira suas credenciais para acessar a plataforma.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email corporativo</FormLabel>
                          <FormControl>
                            <Input placeholder="dr.nome@clinica.com.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Senha</FormLabel>
                            <Link
                              href="/esqueci-a-senha"
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Esqueceu a senha?
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full py-6 text-base"
                      data-testid="button-login-submit"
                    >
                      Entrar na plataforma
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link
                    href="/cadastro"
                    className="font-medium text-primary hover:underline"
                    data-testid="link-to-cadastro"
                  >
                    Cadastre sua clínica
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
