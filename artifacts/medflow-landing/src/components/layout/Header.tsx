import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e5e7eb]">
      <div className="w-full px-8 flex items-center justify-between" style={{ height: "72px" }}>
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#111827]">MedFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="px-6 border-[#166534] text-[#166534] hover:bg-[#f0fdf4]"
            onClick={() => setLocation("/entrar")}
            data-testid="button-header-login"
          >
            Entrar
          </Button>
          <Button
            className="px-6 bg-[#166534] hover:bg-[#14532d] text-white border-0"
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
