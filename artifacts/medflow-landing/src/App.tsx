import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import AppLayout from "@/pages/app/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Agendamentos from "@/pages/app/Agendamentos";
import Pacientes from "@/pages/app/Pacientes";
import Prontuarios from "@/pages/app/Prontuarios";
import Financeiro from "@/pages/app/Financeiro";
import Relatorios from "@/pages/app/Relatorios";
import Configuracoes from "@/pages/app/Configuracoes";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  if (location.startsWith("/app")) {
    return (
      <AppLayout>
        <Switch>
          <Route path="/app" component={Dashboard} />
          <Route path="/app/agendamentos" component={Agendamentos} />
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

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entrar" component={Login} />
      <Route path="/cadastro" component={Cadastro} />
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
