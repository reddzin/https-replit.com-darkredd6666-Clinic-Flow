import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm">
                M
              </div>
              <span className="font-bold text-xl tracking-tight">MedFlow</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Elevando o padrão da gestão clínica no Brasil. O sistema premium para clínicas que buscam excelência.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Produto</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Agendamento</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Prontuário</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Telemedicina</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Faturamento</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Preços</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Empresa</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Clientes</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Segurança</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MedFlow Tecnologia. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Av. Paulista, 1000 - Bela Vista, São Paulo - SP
          </p>
        </div>
      </div>
    </footer>
  );
}