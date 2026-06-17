import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-bold text-xl tracking-tight">MedFlow</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Depoimentos</a>
            <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a href="#login" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">Entrar</a>
          <Button className="rounded-full px-6 shadow-sm" data-testid="button-header-cta">
            Começar Agora
          </Button>
        </div>
      </div>
    </header>
  );
}