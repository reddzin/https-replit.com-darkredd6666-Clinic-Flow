import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-8 flex items-center justify-between" style={{ height: "72px" }}>
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">MedFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="px-6"
            onClick={() => setLocation("/entrar")}
            data-testid="button-header-login"
          >
            Entrar
          </Button>
          <Button
            className="px-6"
            onClick={() => setLocation("/cadastro")}
            data-testid="button-header-cta"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    </header>
  );
}
