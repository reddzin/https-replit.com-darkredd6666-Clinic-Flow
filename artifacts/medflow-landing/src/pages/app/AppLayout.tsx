import { useState, useEffect } from "react";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Activity,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  UsersRound,
  Star,
  Sparkles,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClinicData } from "@/lib/clinic";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Agendamentos", href: "/app/agendamentos", icon: CalendarCheck },
  { label: "Lista de Espera", href: "/app/lista-de-espera", icon: UsersRound },
  { label: "Links", href: "/app/links", icon: Link2 },
  { label: "Avaliações", href: "/app/avaliacoes", icon: Star },
  { label: "Pacientes", href: "/app/pacientes", icon: Users },
  { label: "Prontuários", href: "/app/prontuarios", icon: FileText },
  { label: "Financeiro", href: "/app/financeiro", icon: CreditCard },
  { label: "Relatórios", href: "/app/relatorios", icon: BarChart3 },
];

const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/agendamentos": "Agendamentos",
  "/app/lista-de-espera": "Lista de Espera",
  "/app/links": "Links",
  "/app/avaliacoes": "Avaliações",
  "/app/pacientes": "Pacientes",
  "/app/prontuarios": "Prontuários",
  "/app/financeiro": "Financeiro",
  "/app/relatorios": "Relatórios",
  "/app/configuracoes": "Configurações",
  "/app/avaliar-medflow": "Avaliar o MedFlow",
};

// Reactive clinic data — updates instantly when saveSession fires the custom event
function useClinic() {
  const [data, setData] = useState(() => getClinicData());

  useEffect(() => {
    function refresh() { setData(getClinicData()); }
    window.addEventListener("medflow:session-updated", refresh);
    return () => window.removeEventListener("medflow:session-updated", refresh);
  }, []);

  const name = data?.clinicName ?? "Minha Clínica";
  const email = data?.email ?? "";
  const logoUrl = data?.logoUrl ?? null;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return { name, email, initials, logoUrl };
}

interface AppLayoutProps {
  children: ReactNode;
}

// One-time sync: if the user has a completed session in localStorage but no DB
// record yet (e.g. they onboarded before the DB tables existed), create it now.
function useSyncClinicToDB() {
  useEffect(() => {
    const session = getClinicData();
    if (!session?.onboarding_completed || !session.clinicSlug || !session.email) return;

    const slug = session.clinicSlug.trim().toLowerCase();
    // Check if the record already exists; if not, create it via POST
    fetch(`/api/clinics/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) {
          // Record missing — create it
          fetch("/api/clinics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              clinicName: session.clinicName,
              clinicType: session.clinicType,
              clinicAddress: session.clinicAddress,
              clinicPhone: session.clinicPhone,
              clinicCity: session.clinicCity,
              clinicState: session.clinicState,
              businessHours: session.businessHours,
              doctors: session.doctors,
              appointmentDuration: session.appointmentDuration,
              ownerEmail: session.email,
            }),
          }).catch(console.error);
        }
      })
      .catch(console.error);
  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const clinic = useClinic();
  useSyncClinicToDB();

  const pageTitle = pageTitles[location] ?? "MedFlow";

  const handleLogout = () => {
    // clearSession removes only the auth token from localStorage — clinic data in DB is untouched
    import("@/lib/clinic").then(({ clearSession }) => clearSession());
    setLocation("/entrar");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">MedFlow</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/app" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border/50">
        <Link
          href="/app/configuracoes"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            location === "/app/configuracoes"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
          data-testid="nav-configuracoes"
        >
          <Settings className="w-5 h-5 shrink-0" />
          Configurações
        </Link>
      </div>
    </div>
  );

  const TopHeader = () => (
    <header className="bg-background border-b border-border px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
          onClick={() => setSidebarOpen(true)}
          data-testid="button-mobile-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl hover:bg-muted text-muted-foreground"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
              data-testid="button-user-menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm overflow-hidden">
                {clinic.logoUrl
                  ? <img src={clinic.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  : clinic.initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-tight">{clinic.name}</p>
                <p className="text-xs text-muted-foreground">{clinic.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setLocation("/app/configuracoes")}>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLocation("/app/avaliar-medflow")}>
              <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
              Avaliar o MedFlow
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex overflow-x-hidden">
      {/* Desktop Sidebar — fixed, always fully visible, 240px wide */}
      <aside
        className="hidden md:flex flex-col bg-background border-r border-border"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 240,
          height: "100vh",
          zIndex: 20,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ width: 240, zIndex: 40 }}
              className="fixed left-0 top-0 h-full bg-background border-r border-border md:hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content — offset by exact sidebar width on md+ */}
      <div
        className="flex flex-col min-h-screen w-full"
        style={{ paddingLeft: 0 }}
      >
        <div className="hidden md:block" style={{ width: 240, flexShrink: 0, position: "fixed", pointerEvents: "none" }} />
        <div className="md:ml-[240px] flex flex-col flex-1 min-h-screen">
          <TopHeader />
          <main className="flex-1 p-4 md:p-8">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
