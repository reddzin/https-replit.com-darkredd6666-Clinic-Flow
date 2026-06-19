import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import CadastroPlanos from "@/pages/CadastroPlanos";
import CadastroPagamento from "@/pages/CadastroPagamento";
import Agendar from "@/pages/Agendar";
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
import { getSession } from "@/lib/clinic";

const queryClient = new QueryClient();

/** Wraps /app/* routes: redirects unauthenticated users and those who haven't
 *  completed onboarding before they can access any protected page. */
function ProtectedApp() {
  const session = getSession();

  // No session at all → login
  if (!session?.email || !session?.token) {
    return <Redirect to="/entrar" />;
  }

  // Onboarding not finished → go to /app/onboarding (cannot be skipped)
  if (!session.onboarding_completed) {
    return <Redirect to="/app/onboarding" />;
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
        <Route path="/app/configuracoes" component={Configuracoes} />
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

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entrar" component={Login} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/cadastro/planos" component={CadastroPlanos} />
      <Route path="/cadastro/pagamento" component={CadastroPagamento} />
      <Route path="/agendar/:slug" component={Agendar} />
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
