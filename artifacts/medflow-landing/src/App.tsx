import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import CadastroPlanos from "@/pages/CadastroPlanos";
import CadastroPagamento from "@/pages/CadastroPagamento";
import Agendar from "@/pages/Agendar";
import Review from "@/pages/Review";
import Admin from "@/pages/Admin";
import AvaliarMedFlow from "@/pages/app/AvaliarMedFlow";
import Onboarding from "@/pages/app/Onboarding";
import AppLayout from "@/pages/app/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Agendamentos from "@/pages/app/Agendamentos";
import ListaDeEspera from "@/pages/app/ListaDeEspera";
import Avaliacoes from "@/pages/app/Avaliacoes";
import Pacientes from "@/pages/app/Pacientes";
import Prontuarios from "@/pages/app/Prontuarios";
import Financeiro from "@/pages/app/Financeiro";
import Relatorios from "@/pages/app/Relatorios";
import Configuracoes from "@/pages/app/Configuracoes";
import Links from "@/pages/app/Links";
import Paywall from "@/pages/app/Paywall";
import PacienteLogin from "@/pages/paciente/Login";
import PacienteDashboard from "@/pages/paciente/Dashboard";
import { getSession } from "@/lib/clinic";
import { getPatientSession } from "@/lib/patient";

const queryClient = new QueryClient();

interface SubStatus {
  canAccess: boolean;
  status: string;
  paidUntil: string | null;
}

/** Wraps /app/* routes: redirects unauthenticated users and those who haven't
 *  completed onboarding before they can access any protected page. */
function ProtectedApp() {
  const session = getSession();
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  const checkSub = useCallback(async (isInitial = false) => {
    if (!session?.email) return;
    if (isInitial) setSubLoading(true);
    try {
      const res = await fetch(`/api/cakto/subscription?email=${encodeURIComponent(session.email)}`);
      if (res.ok) {
        const data = await res.json();
        setSub(data);
      } else {
        // On API error, grant access so we don't lock out users due to infra issues
        if (isInitial) setSub({ canAccess: true, status: "unknown", paidUntil: null });
      }
    } catch {
      if (isInitial) setSub({ canAccess: true, status: "unknown", paidUntil: null });
    } finally {
      if (isInitial) setSubLoading(false);
    }
  }, [session?.email]);

  useEffect(() => {
    checkSub(true);
    // Poll every 3 minutes — detects cancellation/failure while user is already logged in
    const interval = setInterval(() => checkSub(false), 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSub]);

  // No session at all → login
  if (!session?.email || !session?.token) {
    return <Redirect to="/entrar" />;
  }

  // Onboarding not finished → go to /app/onboarding (cannot be skipped)
  if (!session.onboarding_completed) {
    return <Redirect to="/app/onboarding" />;
  }

  // While checking subscription, show nothing (avoids flash)
  if (subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Subscription check failed → paywall
  if (sub && !sub.canAccess) {
    return <Paywall status={sub.status} onRetry={checkSub} />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/app" component={Dashboard} />
        <Route path="/app/agendamentos" component={Agendamentos} />
        <Route path="/app/lista-de-espera" component={ListaDeEspera} />
        <Route path="/app/avaliacoes" component={Avaliacoes} />
        <Route path="/app/pacientes" component={Pacientes} />
        <Route path="/app/prontuarios" component={Prontuarios} />
        <Route path="/app/financeiro" component={Financeiro} />
        <Route path="/app/relatorios" component={Relatorios} />
        <Route path="/app/links" component={Links} />
        <Route path="/app/configuracoes" component={Configuracoes} />
        <Route path="/app/avaliar-medflow" component={AvaliarMedFlow} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const [location] = useLocation();

  // /app/onboarding is outside AppLayout (full-screen experience)
  if (location === "/app/onboarding") {
    return <Onboarding />;
  }

  if (location.startsWith("/app")) {
    return <ProtectedApp />;
  }

  if (location === "/admin") {
    return <Admin />;
  }

  // If the user is already logged in and lands on the root, send to dashboard
  const rootSession = getSession();
  if (location === "/") {
    if (rootSession?.email && rootSession?.token && rootSession?.onboarding_completed) {
      return <Redirect to="/app" />;
    }
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entrar" component={Login} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/cadastro/planos" component={CadastroPlanos} />
      <Route path="/cadastro/pagamento" component={CadastroPagamento} />
      <Route path="/booking/:slug" component={Agendar} />
      <Route path="/agendar/:slug" component={Agendar} />
      <Route path="/review/:token" component={Review} />
      <Route path="/paciente/login" component={PacienteLogin} />
      <Route path="/paciente/dashboard" component={PacienteDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
