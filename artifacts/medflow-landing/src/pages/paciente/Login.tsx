import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { savePatientSession, getPatientSession } from "@/lib/patient";

type Mode = "login" | "register";

export default function PacienteLogin() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");

  useEffect(() => {
    const session = getPatientSession();
    if (session?.token) {
      setLocation("/paciente/dashboard");
    }
  }, [setLocation]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/patients/login" : "/api/patients/register";
      const body = mode === "login"
        ? { email, password }
        : { name, phone, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) setError("E-mail já cadastrado. Faça login.");
        else if (res.status === 401) setError("E-mail ou senha incorretos.");
        else setError(data.error ?? "Erro inesperado. Tente novamente.");
        return;
      }

      savePatientSession({
        token: data.token,
        id: data.patient.id,
        name: data.patient.name,
        email: data.patient.email,
        phone: data.patient.phone,
      });

      setLocation("/paciente/dashboard");
    } catch {
      setError("Sem conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-background border-b border-border h-16 flex items-center px-6">
        <button onClick={() => setLocation("/")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">MedFlow</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border rounded-2xl shadow-sm w-full max-w-sm p-8"
        >
          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "register" ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <h1 className="text-xl font-bold text-foreground mb-1">
                {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
              </h1>
              <p className="text-sm text-muted-foreground mb-5">
                {mode === "login"
                  ? "Acesse seu histórico de consultas."
                  : "Acompanhe seus agendamentos em qualquer clínica MedFlow."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Nome completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          required
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-muted/30 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
                  {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
